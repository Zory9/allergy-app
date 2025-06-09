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
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    id integer NOT NULL,
    recipe_id integer,
    original character varying,
    is_allergen boolean,
    replacement character varying,
    quantity character varying
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredients_id_seq OWNER TO postgres;

--
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- Name: modified_recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modified_recipes (
    id integer NOT NULL,
    user_id integer,
    name character varying,
    shortdesc character varying,
    cooktime character varying,
    description text,
    safe boolean
);


ALTER TABLE public.modified_recipes OWNER TO postgres;

--
-- Name: modified_recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modified_recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modified_recipes_id_seq OWNER TO postgres;

--
-- Name: modified_recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modified_recipes_id_seq OWNED BY public.modified_recipes.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    user_id integer,
    name character varying,
    shortdesc character varying,
    cooktime character varying,
    description text
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipes_id_seq OWNER TO postgres;

--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


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
    allergy character varying(200)
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
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- Name: modified_recipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modified_recipes ALTER COLUMN id SET DEFAULT nextval('public.modified_recipes_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_new_id_seq'::regclass);


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredients (id, recipe_id, original, is_allergen, replacement, quantity) FROM stdin;
1	2	1 cup milk	t	1 cup almond milk	1 cup
2	2	2 eggs	f	\N	2
3	2	1 cup flour	f	\N	1 cup
\.


--
-- Data for Name: modified_recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.modified_recipes (id, user_id, name, shortdesc, cooktime, description, safe) FROM stdin;
2	4	Dairy-Free Pancakes	Light pancakes without dairy ingredients	20 minutes	These pancakes are made using plant-based milk and are suitable for people with dairy allergies.	t
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, user_id, name, shortdesc, cooktime, description) FROM stdin;
1	3	Spaghetti Bolognese	A quick and easy pasta dish	30 minutes	This classic Italian pasta dish features a rich and hearty meat sauce served over tender spaghetti noodles.
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, firstname, lastname, allergy) FROM stdin;
3	zst99	zst@gmail.com	$2a$10$50LX3OBD3bYYEUGJIFRuJe14.o53L7G3nR.OzXSxg.HCgI56PEc8i	Зорница	Стоянова	яйца
4	ppetrov16	ppetrov@gmail.com	$2a$10$wWtcei4FMwycbC5HKV9P8OWmL/tRjbpTuqhzcQ8Lv9Iqpc0JD0P0.	Петър	Петров	ядки
5	iivanov12	ivanov@abv.bg	$2a$10$oUIUtu5EDATEuHWKg7McoudFhz3lGBiGI36gOfFg1fYzmpUUti5cG	Иван	Иванов	ядки
6	mang	mangelova@gmail.com	$2a$10$lx/nBZQmI6cs2zB1r6Rq8.omKIM7wfTh5KIWGa/3pfUZ4z0kadsf6	Мария	Ангелова	грах
2	john_doe	john.doe@example.com	$2a$10$.zvTv7KP9iTcT2ihLQUHH..GJ9v/liktNx02vXvD4rwVIbupibld.	John	Doe	Peanuts
7	zstoyanova9	zstoyanova@gmail.com	$2a$10$bo/XRaQ3i0WfPucSP05hW.g20w.IdFTsDevr8MYwYn1Z9JpnMXWvS	Зорница	Стоянова	Яйца
10	exampleUser2	example2@gmail.com	$2a$10$K4xs/mrMAge/HzGEjqrzTekii2xNqsCEABxseEdADsc.1Ysi/U0/a	\N	\N	Гъби, Риба
9	user1example	example1@gmail.com	$2a$10$61G0gC3iPabfD/0BZUpfU.05rhFYUNUmRcQBweaotgFVrKGgMNRha	\N	\N	Бадеми, Мляко, Глутен
\.


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 3, true);


--
-- Name: modified_recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modified_recipes_id_seq', 2, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipes_id_seq', 1, true);


--
-- Name: users_new_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_new_id_seq', 10, true);


--
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- Name: modified_recipes modified_recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modified_recipes
    ADD CONSTRAINT modified_recipes_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


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
-- Name: ingredients ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.modified_recipes(id) ON DELETE CASCADE;


--
-- Name: modified_recipes modified_recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modified_recipes
    ADD CONSTRAINT modified_recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

