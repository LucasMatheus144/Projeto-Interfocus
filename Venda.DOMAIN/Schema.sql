create database projetovalendointerfocus;

create sequence public.clientes_seq;

create table public.clientes(
    id integer primary key default nextval('clientes_seq'),
    nome varchar(25) not null unique,
    cpf varchar(14) not null unique,
    d_datanascimento date not null,
    email varchar(50),
    situacao integer not null
);

create sequence public.dividas_seq;

create table dividas(
    id integer primary key default nextval('dividas_seq'),
    valor decimal(10,2) not null,
    d_datacadastro timestamp default now(),
    d_datapagamento timestamp,
    descricao varchar(50),
    situacao integer not null,
    id_cliente integer,
    CONSTRAINT fx_divida_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);


create function  public.valida_new_divida()
RETURNS TRIGGER AS $$
DECLARE
    total DECIMAL(8, 2);
BEGIN
IF NEW.situacao = 1 THEN -- 1 ->  Pago = 1, Devendo = 2,
        RETURN NEW;
    END IF;

    SELECT COALESCE(SUM(valor), 0) INTO total
    FROM dividas
    WHERE id_cliente = NEW.id_cliente AND situacao = 2;

    IF total + NEW.valor > 200 THEN
        RAISE EXCEPTION 'Valor Superior a 200.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER public.trigger_valida_nova_divida
BEFORE INSERT OR UPDATE ON dividas
FOR EACH ROW
EXECUTE FUNCTION valida_new_divida();


create view public.vis_cliente as
    select cl.id,cl.nome,SUM(d.valor) from clientes cl
          join dividas d on cl.id = d.id_cliente
          group by cl.id, cl.nome
          having sum(d.valor) < 200;

