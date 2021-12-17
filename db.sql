--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

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
-- Name: submissions; Type: TABLE; Schema: public; Owner: ricky
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    "time" timestamp without time zone NOT NULL,
    discordid bigint NOT NULL,
    question integer,
    difficulty character varying,
    language character varying,
    verdict integer,
    semester smallint
);


ALTER TABLE public.submissions OWNER TO ricky;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: ricky
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_id_seq OWNER TO ricky;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ricky
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ricky
--

CREATE TABLE public.users (
    discord_id bigint NOT NULL,
    username character varying(50) NOT NULL,
    experience integer DEFAULT 0
);


ALTER TABLE public.users OWNER TO ricky;

--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: ricky
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: ricky
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ricky
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (discord_id);


--
-- Name: submissions fk_submission; Type: FK CONSTRAINT; Schema: public; Owner: ricky
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT fk_submission FOREIGN KEY (discordid) REFERENCES public.users(discord_id);


--
-- PostgreSQL database dump complete
--

