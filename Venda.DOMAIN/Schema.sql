create sequence public.clientes_seq;

create table public.clientes(
    id integer primary key default nextval('clientes_seq'),
    nome varchar(25) not null unique,
    cpf varchar(14) not null unique,
    d_datanascimento date not null,
    email varchar(50),
    situacao integer not null,
    url_foto text
);

create index idx_clientes_nome on public.clientes(nome);
create index idx_clientes_situacao on public.clientes(situacao);

create sequence public.dividas_seq;

create table dividas(
    id integer primary key default nextval('dividas_seq'),
    valor decimal(10,2) not null,
    d_datacadastro timestamp default now(),
    d_datapagamento timestamp,
    descricao varchar(50),
    situacao integer not null,
    url_pdf text,
    id_cliente integer,
    CONSTRAINT fx_divida_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);

create index idx_dividas_idcliente on public.dividas(id_cliente);


CREATE OR REPLACE FUNCTION public.valida_new_divida()
RETURNS trigger AS
$body$
DECLARE
    total DECIMAL(8, 2);
BEGIN
IF NEW.situacao = 2 THEN -- Pago = 2, Devendo = 1,
        RETURN NEW;
    END IF;

    SELECT COALESCE(SUM(valor), 0) INTO total
    FROM dividas
    WHERE id_cliente = NEW.id_cliente AND situacao = 1;

    IF total + NEW.valor > 200 THEN
        RAISE EXCEPTION 'Valor Superior a 200.';
    END IF;

    RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE TRIGGER  trigger_valida_nova_divida
BEFORE INSERT OR UPDATE ON dividas
FOR EACH ROW
EXECUTE PROCEDURE  valida_new_divida();


create view vis_clientes as
SELECT cl.id,
       cl.nome,
       COALESCE(sum(d.valor), 0::numeric) AS sum
FROM clientes cl
LEFT JOIN dividas d ON cl.id = d.id_cliente
GROUP BY cl.id, cl.nome
HAVING COALESCE(sum(d.valor), 0) < 200;
