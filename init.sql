--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(200) NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    allergy character varying(100),
    severity integer,
    CONSTRAINT users_new_severity_check CHECK (((severity >= 1) AND (severity <= 5)))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_new_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_new_id_seq OWNER TO postgres;

--
-- Name: users_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_new_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_new_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, firstname, lastname, allergy, severity) FROM stdin;
3	zst99	zst@gmail.com	$2a$10$50LX3OBD3bYYEUGJIFRuJe14.o53L7G3nR.OzXSxg.HCgI56PEc8i	Зорница	Стоянова	яйца	5
4	ppetrov16	ppetrov@gmail.com	$2a$10$wWtcei4FMwycbC5HKV9P8OWmL/tRjbpTuqhzcQ8Lv9Iqpc0JD0P0.	Петър	Петров	ядки	3
5	iivanov12	ivanov@abv.bg	$2a$10$oUIUtu5EDATEuHWKg7McoudFhz3lGBiGI36gOfFg1fYzmpUUti5cG	Иван	Иванов	ядки	1
6	mang	mangelova@gmail.com	$2a$10$lx/nBZQmI6cs2zB1r6Rq8.omKIM7wfTh5KIWGa/3pfUZ4z0kadsf6	Мария	Ангелова	грах	3
2	john_doe	john.doe@example.com	$2a$10$.zvTv7KP9iTcT2ihLQUHH..GJ9v/liktNx02vXvD4rwVIbupibld.	John	Doe	Peanuts	3
7	zstoyanova9	zstoyanova@gmail.com	$2a$10$bo/XRaQ3i0WfPucSP05hW.g20w.IdFTsDevr8MYwYn1Z9JpnMXWvS	Зорница	Стоянова	Яйца	5
8	exampleuser1	example@gmail.com	$2a$10$hWLaEkuv2gfuNPTr1HMYRO1rg4acjcV8jOrZxgJc9DyRZ401/J6W2	\N	\N	{"Мляко","Бадеми"}	\N
10	exampleUser2	example2@gmail.com	$2a$10$K4xs/mrMAge/HzGEjqrzTekii2xNqsCEABxseEdADsc.1Ysi/U0/a	\N	\N	Гъби, Риба	\N
9	user1example	example1@gmail.com	$2a$10$61G0gC3iPabfD/0BZUpfU.05rhFYUNUmRcQBweaotgFVrKGgMNRha	\N	\N	Бадеми, Мляко, Глутен	\N
\.


--
-- Name: users_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_new_id_seq', 10, true);


--
-- Name: users users_new_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_email_key UNIQUE (email);


--
-- Name: users users_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_pkey PRIMARY KEY (id);


--
-- Name: users users_new_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

