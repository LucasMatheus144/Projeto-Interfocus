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
    d_datacadastro timestamp,
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





insert into public.clientes (nome, cpf, d_datanascimento, email, situacao, url_foto) values
( 'Rodrigo Interfocus', '361.683.810-07', '1994-01-12', 'teste@teste.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/d4e494de11d244058d97d4b615857685.jpg'),
( 'Lucas Teste', '123.035.500-68', '1995-02-12', 'barbudo@gmail.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/d988e7b109ef439b95331f77652c82f7.jpg'),
( 'Ultimo Romantico', '488.112.150-21', '1960-01-12', 'teste@teste.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/b6259082294d43638a2b4920bb82a9fd.jpg'),
( 'Tiago Romeu', '049.488.970-51', '1995-01-12', 'tiago.romeu@Interfocus.com.br', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/20da8e4e1ffb453d865f7d6bbcf9ba79.jpg'),
( 'Carlinhos kk', '806.173.210-60', '1940-01-12', 'carlinhos.teste@gmail.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/6170525dfd904df08fc792172ef13e0c.jpg'),
( 'Acabou A Criatividade', '491.892.160-40', '1994-01-12', 'teste.teste@gmail.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/3927eca72f044680af2f79df99024fa1.jpg'),
( 'A Empresaria', '140.971.060-23', '2003-01-12', 'empresaria@empresa.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/a7f446b82b5547bdbc287e42a8b2e95a.jpg'),
( 'Lucas Marques', '445.776.970-33', '1995-01-12', 'lucas.marques@interfocus.com.br', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/7271598d19944adabc1d081610cb4caf.jpg'),
( 'Junior Esticado', '414.393.040-41', '2005-12-12', 'esticadinho@gmail.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/2e9d4903d1d14727a6dd733bb9f33b5c.jpg'),
( 'Zen O', '898.872.480-10', '1995-07-01', 'teste@teste.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/b26e7c19bf184ffc95fb8ecb6df6f6ab.jpg'),
( 'Cassia Gestora', '363.827.450-06', '1990-01-12', 'teste@teste.com', 1, 'https://bagimgs.s3.us-east-1.amazonaws.com/41030fc4d5a2431698e2034a3e64eb9c.jpg');

