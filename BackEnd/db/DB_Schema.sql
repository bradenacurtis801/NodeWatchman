--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.1

-- Started on 2024-03-31 14:23:31

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
-- TOC entry 221 (class 1259 OID 16448)
-- Name: approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approvals (
    approval_id integer NOT NULL,
    user_id integer,
    admin_user_id integer,
    approval_status character varying(20),
    approval_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.approvals OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16447)
-- Name: approvals_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approvals_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approvals_approval_id_seq OWNER TO postgres;

--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 220
-- Name: approvals_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approvals_approval_id_seq OWNED BY public.approvals.approval_id;


--
-- TOC entry 222 (class 1259 OID 16466)
-- Name: dc02_hardware; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dc02_hardware (
    machine_id character varying(20) NOT NULL,
    status jsonb
);


ALTER TABLE public.dc02_hardware OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16426)
-- Name: login_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_methods (
    login_id integer NOT NULL,
    user_id integer,
    login_method character varying(20),
    login_identifier character varying(255)
);


ALTER TABLE public.login_methods OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16425)
-- Name: login_methods_login_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_methods_login_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_methods_login_id_seq OWNER TO postgres;

--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 217
-- Name: login_methods_login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_methods_login_id_seq OWNED BY public.login_methods.login_id;


--
-- TOC entry 219 (class 1259 OID 16439)
-- Name: machine_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machine_status (
    machine_id character varying(20) NOT NULL,
    status jsonb
);


ALTER TABLE public.machine_status OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16411)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255),
    email character varying(255),
    phone_number character varying(20),
    password_hash character varying(255),
    status character varying(20) DEFAULT 'pending'::character varying,
    role character varying(20) DEFAULT 'user'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16410)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3225 (class 2604 OID 16451)
-- Name: approvals approval_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals ALTER COLUMN approval_id SET DEFAULT nextval('public.approvals_approval_id_seq'::regclass);


--
-- TOC entry 3224 (class 2604 OID 16429)
-- Name: login_methods login_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_methods ALTER COLUMN login_id SET DEFAULT nextval('public.login_methods_login_id_seq'::regclass);


--
-- TOC entry 3221 (class 2604 OID 16414)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3397 (class 0 OID 16448)
-- Dependencies: 221
-- Data for Name: approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approvals (approval_id, user_id, admin_user_id, approval_status, approval_date) FROM stdin;
1	1	1	approved	2024-03-31 18:39:28.842133
\.


--
-- TOC entry 3398 (class 0 OID 16466)
-- Dependencies: 222
-- Data for Name: dc02_hardware; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dc02_hardware (machine_id, status) FROM stdin;
A1-11-1	{"IP": "10.10.11.1", "PDU IP": "10.10.200.11", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:12", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:56"}}
A1-11-2	{"IP": "10.10.11.2", "PDU IP": "10.10.200.11", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:7e:88", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:e0"}}
A1-11-3	{"IP": "10.10.11.3", "PDU IP": "10.10.200.11", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:01", "MAC (NIC-1) enp031f6": "74:86:e2:13:89:a7"}}
A1-11-4	{"IP": "10.10.11.4", "PDU IP": "10.10.200.11", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:1b", "MAC (NIC-1) enp031f6": "74:86:e2:13:61:db"}}
A1-11-5	{"IP": "10.10.11.5", "PDU IP": "10.10.200.11", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:67", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:70"}}
A1-11-6	{"IP": "10.10.11.6", "PDU IP": "10.10.200.11", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:57", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:49"}}
A1-11-7	{"IP": "10.10.11.7", "PDU IP": "10.10.200.11", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8a:ab", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:54"}}
A1-11-8	{"IP": "10.10.11.8", "PDU IP": "10.10.200.11", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:62", "MAC (NIC-1) enp031f6": "74:86:e2:13:61:ec"}}
A1-11-9	{"IP": "10.10.11.9", "PDU IP": "10.10.200.11", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:94", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:0f"}}
A1-11-10	{"IP": "10.10.11.10", "PDU IP": "10.10.200.11", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:92:31", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:ce"}}
A1-11-11	{"IP": "10.10.11.11", "PDU IP": "10.10.200.11", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:86:83", "MAC (NIC-1) enp031f6": "74:86:e2:13:87:1d"}}
A1-11-12	{"IP": "10.10.11.12", "PDU IP": "10.10.200.11", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:ff", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:a2"}}
A1-11-13	{"IP": "10.10.11.13", "PDU IP": "10.10.200.11", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:07", "MAC (NIC-1) enp031f6": "74:86:e2:13:89:b0"}}
A1-11-14	{"IP": "10.10.11.14", "PDU IP": "10.10.200.11", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:52", "MAC (NIC-1) enp031f6": "74:86:e2:13:8a:97"}}
A1-11-15	{"IP": "10.10.11.15", "PDU IP": "10.10.200.11", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:54", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:21"}}
A1-11-16	{"IP": "10.10.11.16", "PDU IP": "10.10.200.11", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:f7", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:63"}}
A1-11-17	{"IP": "10.10.11.17", "PDU IP": "10.10.200.11", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:e1", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:af"}}
A1-11-18	{"IP": "10.10.11.18", "PDU IP": "10.10.200.11", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:74", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:47"}}
A1-11-19	{"IP": "10.10.11.19", "PDU IP": "10.10.200.11", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:62:87", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:f3"}}
A1-11-20	{"IP": "10.10.11.20", "PDU IP": "10.10.200.11", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:8a", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:1e"}}
A1-12-1	{"IP": "10.10.12.1", "PDU IP": "10.10.200.12", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:ae:9a", "MAC (NIC-1) enp031f6": "74:86:e2:13:af:3c"}}
A1-12-2	{"IP": "10.10.12.2", "PDU IP": "10.10.200.12", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:26", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:11"}}
A1-12-3	{"IP": "10.10.12.3", "PDU IP": "10.10.200.12", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:9a", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:80"}}
A1-12-4	{"IP": "10.10.12.4", "PDU IP": "10.10.200.12", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:6c", "MAC (NIC-1) enp031f6": "74:86:e2:13:61:df"}}
A1-12-5	{"IP": "10.10.12.5", "PDU IP": "10.10.200.12", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:cb", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:a7"}}
A1-12-6	{"IP": "10.10.12.6", "PDU IP": "10.10.200.12", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:88:cb", "MAC (NIC-1) enp031f6": "74:86:e2:13:8a:8f"}}
A1-12-7	{"IP": "10.10.12.7", "PDU IP": "10.10.200.12", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:ea", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:90"}}
A1-12-8	{"IP": "10.10.12.8", "PDU IP": "10.10.200.12", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:81", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:7f"}}
A1-12-9	{"IP": "10.10.12.9", "PDU IP": "10.10.200.12", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:7f", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:0d"}}
A1-12-10	{"IP": "10.10.12.10", "PDU IP": "10.10.200.12", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:91", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:85"}}
A1-12-11	{"IP": "10.10.12.11", "PDU IP": "10.10.200.12", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:ca", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:57"}}
A1-12-12	{"IP": "10.10.12.12", "PDU IP": "10.10.200.12", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:15:10:7c", "MAC (NIC-1) enp031f6": "74:86:e2:15:12:b1"}}
A1-12-13	{"IP": "10.10.12.13", "PDU IP": "10.10.200.12", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8a:69", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:38"}}
A1-12-14	{"IP": "10.10.12.14", "PDU IP": "10.10.200.12", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:78", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:1c"}}
A1-12-15	{"IP": "10.10.12.15", "PDU IP": "10.10.200.12", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:58", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:14"}}
A1-12-16	{"IP": "10.10.12.16", "PDU IP": "10.10.200.12", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:39", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:ee"}}
A1-12-17	{"IP": "10.10.12.17", "PDU IP": "10.10.200.12", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8e:d4", "MAC (NIC-1) enp031f6": "74:86:e2:13:91:15"}}
A1-12-18	{"IP": "10.10.12.18", "PDU IP": "10.10.200.12", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8d:bb", "MAC (NIC-1) enp031f6": "74:86:e2:13:91:0c"}}
A1-12-19	{"IP": "10.10.12.19", "PDU IP": "10.10.200.12", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:8c", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:8e"}}
A1-12-20	{"IP": "10.10.12.20", "PDU IP": "10.10.200.12", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:3f", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:07"}}
A1-13-1	{"IP": "10.10.13.1", "PDU IP": "10.10.200.13", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:67", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:10"}}
A1-13-2	{"IP": "10.10.13.2", "PDU IP": "10.10.200.13", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:bb", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:3b"}}
A1-13-3	{"IP": "10.10.13.3", "PDU IP": "10.10.200.13", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:87", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:19"}}
A1-13-4	{"IP": "10.10.13.4", "PDU IP": "10.10.200.13", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:c0", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:6b"}}
A1-13-5	{"IP": "10.10.13.5", "PDU IP": "10.10.200.13", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:24", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:d6"}}
A1-13-6	{"IP": "10.10.13.6", "PDU IP": "10.10.200.13", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:af", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:0c"}}
A1-13-7	{"IP": "10.10.13.7", "PDU IP": "10.10.200.13", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:f3", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:5f"}}
A1-13-8	{"IP": "10.10.13.8", "PDU IP": "10.10.200.13", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:27", "MAC (NIC-1) enp031f6": "74:86:e2:13:91:e5"}}
A1-13-9	{"IP": "10.10.13.9", "PDU IP": "10.10.200.13", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:5e", "MAC (NIC-1) enp031f6": "74:86:e2:13:61:ee"}}
A1-13-10	{"IP": "10.10.13.10", "PDU IP": "10.10.200.13", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:c1", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:cd"}}
A1-13-11	{"IP": "10.10.13.11", "PDU IP": "10.10.200.13", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:60:33", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:f0"}}
A1-13-12	{"IP": "10.10.13.12", "PDU IP": "10.10.200.13", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:2f", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:34"}}
A1-13-13	{"IP": "10.10.13.13", "PDU IP": "10.10.200.13", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:ec", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:aa"}}
A1-13-14	{"IP": "10.10.13.14", "PDU IP": "10.10.200.13", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:1a", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:5e"}}
A1-13-15	{"IP": "10.10.13.15", "PDU IP": "10.10.200.13", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:14:ff:27", "MAC (NIC-1) enp031f6": "74:86:e2:15:03:1c"}}
A1-13-16	{"IP": "10.10.13.16", "PDU IP": "10.10.200.13", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:d3", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:b0"}}
A1-13-17	{"IP": "10.10.13.17", "PDU IP": "10.10.200.13", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:a4", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:d0"}}
A1-13-18	{"IP": "10.10.13.18", "PDU IP": "10.10.200.13", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:90", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:3c"}}
A1-13-19	{"IP": "10.10.13.19", "PDU IP": "10.10.200.13", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:4f", "MAC (NIC-1) enp031f6": "74:86:e2:13:b0:f8"}}
A1-13-20	{"IP": "10.10.13.20", "PDU IP": "10.10.200.13", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:6a", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:fa"}}
A1-14-1	{"IP": "10.10.14.1", "PDU IP": "10.10.200.14", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:63:dd", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:f4"}}
A1-14-2	{"IP": "10.10.14.2", "PDU IP": "10.10.200.14", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:a6", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:96"}}
A1-14-3	{"IP": "10.10.14.3", "PDU IP": "10.10.200.14", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:cd", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:89"}}
A1-14-4	{"IP": "10.10.14.4", "PDU IP": "10.10.200.14", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:88:12", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:aa"}}
A1-14-5	{"IP": "10.10.14.5", "PDU IP": "10.10.200.14", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:9b", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:6e"}}
A1-14-6	{"IP": "10.10.14.6", "PDU IP": "10.10.200.14", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:7c", "MAC (NIC-1) enp031f6": ""}}
A1-14-7	{"IP": "10.10.14.7", "PDU IP": "10.10.200.14", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:86:5d", "MAC (NIC-1) enp031f6": "74:86:e2:13:87:8e"}}
A1-14-8	{"IP": "10.10.14.8", "PDU IP": "10.10.200.14", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:61", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:20"}}
A1-14-9	{"IP": "10.10.14.9", "PDU IP": "10.10.200.14", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:e0", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:e9"}}
A1-14-10	{"IP": "10.10.14.10", "PDU IP": "10.10.200.14", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9c:d7", "MAC (NIC-1) enp031f6": "74:86:e2:13:9d:ea"}}
A1-14-11	{"IP": "10.10.14.11", "PDU IP": "10.10.200.14", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:3c", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:f4"}}
A1-14-12	{"IP": "10.10.14.12", "PDU IP": "10.10.200.14", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:a1:64", "MAC (NIC-1) enp031f6": "74:86:e2:13:a2:05"}}
A1-14-13	{"IP": "10.10.14.13", "PDU IP": "10.10.200.14", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:70", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:52"}}
A1-14-14	{"IP": "10.10.14.14", "PDU IP": "10.10.200.14", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:5f", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:0b"}}
A1-14-15	{"IP": "10.10.14.15", "PDU IP": "10.10.200.14", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:bf", "MAC (NIC-1) enp031f6": "74:86:e2:13:9c:7a"}}
A1-14-16	{"IP": "10.10.14.16", "PDU IP": "10.10.200.14", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:da", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:4b"}}
A1-14-17	{"IP": "10.10.14.17", "PDU IP": "10.10.200.14", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:0b", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:bd"}}
A1-14-18	{"IP": "10.10.14.18", "PDU IP": "10.10.200.14", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:61:d2", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:32"}}
A1-14-19	{"IP": "10.10.14.19", "PDU IP": "10.10.200.14", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8b:3e", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:ed"}}
A1-14-20	{"IP": "10.10.14.20", "PDU IP": "10.10.200.14", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:c2", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:68"}}
A2-21-1	{"IP": "10.10.21.1", "PDU IP": "10.10.200.21", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9c:39", "MAC (NIC-1) enp031f6": "74:86:e2:13:9c:ec"}}
A2-21-2	{"IP": "10.10.21.2", "PDU IP": "10.10.200.21", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:60:47", "MAC (NIC-1) enp031f6": "74:86:e2:10:62:08"}}
A2-21-3	{"IP": "10.10.21.3", "PDU IP": "10.10.200.21", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:15", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:86"}}
A2-21-4	{"IP": "10.10.21.4", "PDU IP": "10.10.200.21", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:1f", "MAC (NIC-1) enp031f6": "74:86:e2:10:64:ae"}}
A2-21-5	{"IP": "10.10.21.5", "PDU IP": "10.10.200.21", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:64:40", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:81"}}
A2-21-6	{"IP": "10.10.21.6", "PDU IP": "10.10.200.21", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:4b", "MAC (NIC-1) enp031f6": "74:86:e2:10:61:0a"}}
A2-21-7	{"IP": "10.10.21.7", "PDU IP": "10.10.200.21", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:34:64", "MAC (NIC-1) enp031f6": "74:86:e2:10:6a:ac"}}
A2-21-8	{"IP": "10.10.21.8", "PDU IP": "10.10.200.21", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:fb", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:1c"}}
A2-21-9	{"IP": "10.10.21.9", "PDU IP": "10.10.200.21", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:81:74", "MAC (NIC-1) enp031f6": "74:86:e2:09:82:9d"}}
A2-21-10	{"IP": "10.10.21.10", "PDU IP": "10.10.200.21", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:dc", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:af"}}
A2-21-11	{"IP": "10.10.21.11", "PDU IP": "10.10.200.21", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:66:f5", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:66"}}
A2-21-12	{"IP": "10.10.21.12", "PDU IP": "10.10.200.21", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:60:c0", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:ca"}}
A2-21-13	{"IP": "10.10.21.13", "PDU IP": "10.10.200.21", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5e:c9", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:69"}}
A2-21-14	{"IP": "10.10.21.14", "PDU IP": "10.10.200.21", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:0a", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:98"}}
A2-21-15	{"IP": "10.10.21.15", "PDU IP": "10.10.200.21", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5e:ae", "MAC (NIC-1) enp031f6": "74:86:e2:10:5f:8f"}}
A2-21-16	{"IP": "10.10.21.16", "PDU IP": "10.10.200.21", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5e:ef", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:96"}}
A2-21-17	{"IP": "10.10.21.17", "PDU IP": "10.10.200.21", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:50:66", "MAC (NIC-1) enp031f6": "74:86:e2:10:55:df"}}
A2-21-18	{"IP": "10.10.21.18", "PDU IP": "10.10.200.21", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:20", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:6e"}}
A2-21-19	{"IP": "10.10.21.19", "PDU IP": "10.10.200.21", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:61:f2", "MAC (NIC-1) enp031f6": "74:86:e2:10:63:17"}}
A2-21-20	{"IP": "10.10.21.20", "PDU IP": "10.10.200.21", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:62:22", "MAC (NIC-1) enp031f6": "74:86:e2:10:63:3f"}}
A2-22-1	{"IP": "10.10.22.1", "PDU IP": "10.10.200.22", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:e8", "MAC (NIC-1) enp031f6": "74:86:e2:13:9c:c1"}}
A2-22-2	{"IP": "10.10.22.2", "PDU IP": "10.10.200.22", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:dd", "MAC (NIC-1) enp031f6": "74:86:e2:13:9e:dd"}}
A2-22-3	{"IP": "10.10.22.3", "PDU IP": "10.10.200.22", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9c:eb", "MAC (NIC-1) enp031f6": "74:86:e2:13:9d:9c"}}
A2-22-4	{"IP": "10.10.22.4", "PDU IP": "10.10.200.22", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9f:9b", "MAC (NIC-1) enp031f6": "74:86:e2:13:9f:ea"}}
A2-22-5	{"IP": "10.10.22.5", "PDU IP": "10.10.200.22", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:99:cd", "MAC (NIC-1) enp031f6": "74:86:e2:13:9b:e2"}}
A2-22-6	{"IP": "10.10.22.6", "PDU IP": "10.10.200.22", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:69:97", "MAC (NIC-1) enp031f6": "74:86:e2:10:6c:c2"}}
A2-22-7	{"IP": "10.10.22.7", "PDU IP": "10.10.200.22", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6f:11", "MAC (NIC-1) enp031f6": "74:86:e2:09:70:08"}}
A2-22-8	{"IP": "10.10.22.8", "PDU IP": "10.10.200.22", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:69:89", "MAC (NIC-1) enp031f6": "74:86:e2:10:6c:22"}}
A2-22-9	{"IP": "10.10.22.9", "PDU IP": "10.10.200.22", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:65:93", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:b2"}}
A2-22-10	{"IP": "10.10.22.10", "PDU IP": "10.10.200.22", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:74:eb", "MAC (NIC-1) enp031f6": "74:86:e2:09:76:4e"}}
A2-22-11	{"IP": "10.10.22.11", "PDU IP": "10.10.200.22", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:66:6b", "MAC (NIC-1) enp031f6": "74:86:e2:10:6a:6a"}}
A2-22-12	{"IP": "10.10.22.12", "PDU IP": "10.10.200.22", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:02", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:86"}}
A2-22-13	{"IP": "10.10.22.13", "PDU IP": "10.10.200.22", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:65:15", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:9e"}}
A2-22-14	{"IP": "10.10.22.14", "PDU IP": "10.10.200.22", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:23", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:39"}}
A2-22-15	{"IP": "10.10.22.15", "PDU IP": "10.10.200.22", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6d:31", "MAC (NIC-1) enp031f6": "74:86:e2:09:6e:48"}}
A2-22-16	{"IP": "10.10.22.16", "PDU IP": "10.10.200.22", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:65:6c", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:99"}}
A2-22-17	{"IP": "10.10.22.17", "PDU IP": "10.10.200.22", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:62:17", "MAC (NIC-1) enp031f6": "74:86:e2:10:63:1a"}}
A2-22-18	{"IP": "10.10.22.18", "PDU IP": "10.10.200.22", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:50", "MAC (NIC-1) enp031f6": "74:86:e2:10:64:b4"}}
A2-22-19	{"IP": "10.10.22.19", "PDU IP": "10.10.200.22", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:61:e2", "MAC (NIC-1) enp031f6": "74:86:e2:10:62:f1"}}
A2-22-20	{"IP": "10.10.22.20", "PDU IP": "10.10.200.22", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:60:2c", "MAC (NIC-1) enp031f6": "74:86:e2:10:61:20"}}
A2-23-1	{"IP": "10.10.23.1", "PDU IP": "10.10.200.23", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9d:8e", "MAC (NIC-1) enp031f6": "74:86:e2:13:9f:ec"}}
A2-23-2	{"IP": "10.10.23.2", "PDU IP": "10.10.200.23", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:12:d2:37", "MAC (NIC-1) enp031f6": "74:86:e2:12:d5:75"}}
A2-23-3	{"IP": "10.10.23.3", "PDU IP": "10.10.200.23", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
A2-23-4	{"IP": "10.10.23.4", "PDU IP": "10.10.200.23", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:c8:e4", "MAC (NIC-1) enp031f6": "74:86:e2:13:c9:6a"}}
A2-23-5	{"IP": "10.10.23.5", "PDU IP": "10.10.200.23", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:c8", "MAC (NIC-1) enp031f6": "74:86:e2:13:9a:e1"}}
A2-23-6	{"IP": "10.10.23.6", "PDU IP": "10.10.200.23", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:68:54", "MAC (NIC-1) enp031f6": "74:86:e2:10:69:6b"}}
A2-23-7	{"IP": "10.10.23.7", "PDU IP": "10.10.200.23", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:68", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:90"}}
A2-23-8	{"IP": "10.10.23.8", "PDU IP": "10.10.200.23", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:6a:47", "MAC (NIC-1) enp031f6": "74:86:e2:10:6b:49"}}
A2-23-9	{"IP": "10.10.23.9", "PDU IP": "10.10.200.23", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6d:6c", "MAC (NIC-1) enp031f6": "74:86:e2:09:6f:6d"}}
A2-23-10	{"IP": "10.10.23.10", "PDU IP": "10.10.200.23", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6a:bc", "MAC (NIC-1) enp031f6": "74:86:e2:09:6d:9f"}}
A2-23-11	{"IP": "10.10.23.11", "PDU IP": "10.10.200.23", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:56:a5", "MAC (NIC-1) enp031f6": "74:86:e2:10:5b:9b"}}
A2-23-12	{"IP": "10.10.23.12", "PDU IP": "10.10.200.23", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:3c", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:aa"}}
A2-23-13	{"IP": "10.10.23.13", "PDU IP": "10.10.200.23", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:0f", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:49"}}
A2-23-14	{"IP": "10.10.23.14", "PDU IP": "10.10.200.23", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:15", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:bf"}}
A2-23-15	{"IP": "10.10.23.15", "PDU IP": "10.10.200.23", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:62:0c", "MAC (NIC-1) enp031f6": "74:86:e2:10:64:5e"}}
A2-23-16	{"IP": "10.10.23.16", "PDU IP": "10.10.200.23", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:74:dc", "MAC (NIC-1) enp031f6": "74:86:e2:09:76:0a"}}
A2-23-17	{"IP": "10.10.23.17", "PDU IP": "10.10.200.23", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:6b:56", "MAC (NIC-1) enp031f6": "74:86:e2:10:6c:d8"}}
A2-23-18	{"IP": "10.10.23.18", "PDU IP": "10.10.200.23", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:69:a0", "MAC (NIC-1) enp031f6": "74:86:e2:10:6a:a9"}}
A2-23-19	{"IP": "10.10.23.19", "PDU IP": "10.10.200.23", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:01", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:be"}}
A2-23-20	{"IP": "10.10.23.20", "PDU IP": "10.10.200.23", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:68:02", "MAC (NIC-1) enp031f6": "74:86:e2:10:6c:92"}}
A2-24-1	{"IP": "10.10.24.1", "PDU IP": "10.10.200.24", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6d:79", "MAC (NIC-1) enp031f6": "74:86:e2:09:6e:83"}}
A2-24-2	{"IP": "10.10.24.2", "PDU IP": "10.10.200.24", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:24", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:3d"}}
A2-24-3	{"IP": "10.10.24.3", "PDU IP": "10.10.200.24", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6e:2d", "MAC (NIC-1) enp031f6": "74:86:e2:09:6f:51"}}
A2-24-4	{"IP": "10.10.24.4", "PDU IP": "10.10.200.24", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6e:f4", "MAC (NIC-1) enp031f6": "74:86:e2:09:6f:d8"}}
A2-24-5	{"IP": "10.10.24.5", "PDU IP": "10.10.200.24", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:68:cf", "MAC (NIC-1) enp031f6": "74:86:e2:10:69:fc"}}
A2-24-6	{"IP": "10.10.24.6", "PDU IP": "10.10.200.24", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:2d:33", "MAC (NIC-1) enp031f6": "74:86:e2:10:62:ad"}}
A2-24-7	{"IP": "10.10.24.7", "PDU IP": "10.10.200.24", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:30", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:56"}}
A2-24-8	{"IP": "10.10.24.8", "PDU IP": "10.10.200.24", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:30:79", "MAC (NIC-1) enp031f6": "74:86:e2:10:31:bb"}}
A2-24-9	{"IP": "10.10.24.9", "PDU IP": "10.10.200.24", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:2f:9f", "MAC (NIC-1) enp031f6": "74:86:e2:10:42:30"}}
A2-24-10	{"IP": "10.10.24.10", "PDU IP": "10.10.200.24", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:1c:70", "MAC (NIC-1) enp031f6": "74:86:e2:10:61:f8"}}
A2-24-11	{"IP": "10.10.24.11", "PDU IP": "10.10.200.24", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:64:b7", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:ff"}}
A2-24-12	{"IP": "10.10.24.12", "PDU IP": "10.10.200.24", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:65:30", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:45"}}
A2-24-13	{"IP": "10.10.24.13", "PDU IP": "10.10.200.24", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:2a", "MAC (NIC-1) enp031f6": "74:86:e2:10:64:b5"}}
A2-24-14	{"IP": "10.10.24.14", "PDU IP": "10.10.200.24", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:66:cd", "MAC (NIC-1) enp031f6": "74:86:e2:10:67:c4"}}
A2-24-15	{"IP": "10.10.24.15", "PDU IP": "10.10.200.24", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:09:6e:4e", "MAC (NIC-1) enp031f6": "74:86:e2:09:6f:33"}}
A2-24-16	{"IP": "10.10.24.16", "PDU IP": "10.10.200.24", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:60:ea", "MAC (NIC-1) enp031f6": "74:86:e2:10:62:23"}}
A2-24-17	{"IP": "10.10.24.17", "PDU IP": "10.10.200.24", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
A2-24-18	{"IP": "10.10.24.18", "PDU IP": "10.10.200.24", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:65:79", "MAC (NIC-1) enp031f6": "74:86:e2:10:66:aa"}}
A2-24-19	{"IP": "10.10.24.19", "PDU IP": "10.10.200.24", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5f:e2", "MAC (NIC-1) enp031f6": "74:86:e2:10:61:e1"}}
A2-24-20	{"IP": "10.10.24.20", "PDU IP": "10.10.200.24", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:61:cd", "MAC (NIC-1) enp031f6": "74:86:e2:10:62:f4"}}
A2-25-1	{"IP": "10.10.25.1", "PDU IP": "10.10.200.25", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:ea", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:c9"}}
A2-25-2	{"IP": "10.10.25.2", "PDU IP": "10.10.200.25", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:af:fb", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:30"}}
A2-25-3	{"IP": "10.10.25.3", "PDU IP": "10.10.200.25", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:93", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:b1"}}
A2-25-4	{"IP": "10.10.25.4", "PDU IP": "10.10.200.25", "PDU Port": "34", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:2c", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:d4"}}
A2-25-5	{"IP": "10.10.25.5", "PDU IP": "10.10.200.25", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
A2-25-6	{"IP": "10.10.25.6", "PDU IP": "10.10.200.25", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:ae:92", "MAC (NIC-1) enp031f6": "74:86:e2:13:b0:56"}}
A2-25-7	{"IP": "10.10.25.7", "PDU IP": "10.10.200.25", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:af:f5", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:44"}}
A2-25-8	{"IP": "10.10.25.8", "PDU IP": "10.10.200.25", "PDU Port": "38", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b0:fb", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:90"}}
A2-25-9	{"IP": "10.10.25.9", "PDU IP": "10.10.200.25", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:62:ca", "MAC (NIC-1) enp031f6": "74:86:e2:10:64:85"}}
A2-25-10	{"IP": "10.10.25.10", "PDU IP": "10.10.200.25", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:4f", "MAC (NIC-1) enp031f6": "74:86:e2:10:68:b7"}}
A2-25-11	{"IP": "10.10.25.11", "PDU IP": "10.10.200.25", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:a0:0f", "MAC (NIC-1) enp031f6": "74:86:e2:13:a1:de"}}
A2-25-12	{"IP": "10.10.25.12", "PDU IP": "10.10.200.25", "PDU Port": "42", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9d:4d", "MAC (NIC-1) enp031f6": "74:86:e2:13:9f:e2"}}
A2-25-13	{"IP": "10.10.25.13", "PDU IP": "10.10.200.25", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9d:89", "MAC (NIC-1) enp031f6": "74:86:e2:13:9f:d7"}}
A2-25-14	{"IP": "10.10.25.14", "PDU IP": "10.10.200.25", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9c:bb", "MAC (NIC-1) enp031f6": "74:86:e2:13:9e:7d"}}
A2-25-15	{"IP": "10.10.25.15", "PDU IP": "10.10.200.25", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:5e:ff", "MAC (NIC-1) enp031f6": "74:86:e2:10:60:a1"}}
A2-25-16	{"IP": "10.10.25.16", "PDU IP": "10.10.200.25", "PDU Port": "46", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:7b:5a", "MAC (NIC-1) enp031f6": "74:86:e2:10:81:78"}}
A2-25-17	{"IP": "10.10.25.17", "PDU IP": "10.10.200.25", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:64:7d", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:88"}}
A2-25-18	{"IP": "10.10.25.18", "PDU IP": "10.10.200.25", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:51:36", "MAC (NIC-1) enp031f6": "74:86:e2:10:52:bc"}}
A2-25-19	{"IP": "10.10.25.19", "PDU IP": "10.10.200.25", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:7e:fc", "MAC (NIC-1) enp031f6": "74:86:e2:10:81:86"}}
A2-25-20	{"IP": "10.10.25.20", "PDU IP": "10.10.200.25", "PDU Port": "30", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:7b", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:62"}}
B1-111-1	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:f9", "MAC (NIC-1) enp031f6": "74:86:e2:13:b5:6e"}}
B1-111-2	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:af:c2", "MAC (NIC-1) enp031f6": "74:86:e2:13:b1:74"}}
B1-111-3	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:81", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:5a"}}
B1-111-4	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b3:0c", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:e0"}}
B1-111-5	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8a:d6", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:62"}}
B1-111-6	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:a1:82", "MAC (NIC-1) enp031f6": "74:86:e2:13:a2:12"}}
B1-111-7	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:69:61", "MAC (NIC-1) enp031f6": "74:86:e2:10:6c:99"}}
B1-111-8	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8a:92", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:52"}}
B1-111-9	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:28", "MAC (NIC-1) enp031f6": "74:86:e2:13:9b:e5"}}
B1-111-10	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b3:16", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:d1"}}
B1-111-11	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:b9", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:53"}}
B1-111-12	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:64:21", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:a3"}}
B1-111-13	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:83:15", "MAC (NIC-1) enp031f6": "74:86:e2:13:86:ab"}}
B1-111-14	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:a6", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:2d"}}
B1-111-15	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:63:de", "MAC (NIC-1) enp031f6": "74:86:e2:13:b5:03"}}
B1-111-16	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:90:8d", "MAC (NIC-1) enp031f6": "74:86:e2:13:91:43"}}
B1-111-17	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:7a:25", "MAC (NIC-1) enp031f6": "74:86:e2:13:7d:28"}}
B1-111-18	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8c:a3", "MAC (NIC-1) enp031f6": "74:86:e2:13:8d:7b"}}
B1-111-19	{"IP": "Y", "PDU IP": "10.10.200.111", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b3:03", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:b0"}}
B1-111-20	{"IP": "Y", "PDU IP": "10.10.200.112", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:86:42", "MAC (NIC-1) enp031f6": "74:86:e2:13:86:e2"}}
B1-112-1	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:84:27", "MAC (NIC-1) enp031f6": "74:86:e2:13:85:91"}}
B1-112-2	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:85:34", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:3f"}}
B1-112-3	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:22", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:7e"}}
B1-112-4	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:ae:ea", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:cf"}}
B1-112-5	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8e:44", "MAC (NIC-1) enp031f6": "74:86:e2:13:8e:eb"}}
B1-112-6	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:92:d8", "MAC (NIC-1) enp031f6": "74:86:e2:13:93:61"}}
B1-112-7	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:5e", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:41"}}
B1-112-8	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8e:50", "MAC (NIC-1) enp031f6": "74:86:e2:13:8e:fc"}}
B1-112-9	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:a0", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:6c"}}
B1-112-10	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:63:45", "MAC (NIC-1) enp031f6": "74:86:e2:10:65:c2"}}
B1-112-11	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:ec", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:a1"}}
B1-112-12	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:84:ee", "MAC (NIC-1) enp031f6": "74:86:e2:13:85:ff"}}
B1-112-13	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:cf", "MAC (NIC-1) enp031f6": "74:86:e2:13:b5:63"}}
B1-112-14	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:cc", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:f7"}}
B1-112-15	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:46", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:76"}}
B1-112-16	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:b1", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:ea"}}
B1-112-17	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:ac", "MAC (NIC-1) enp031f6": "74:86:e2:13:b5:97"}}
B1-112-18	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b2:c1", "MAC (NIC-1) enp031f6": "74:86:e2:13:b3:a4"}}
B1-112-19	{"IP": "Y", "PDU IP": "10.10.200.113", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:86:f2", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:9a"}}
B1-112-20	{"IP": "Y", "PDU IP": "10.10.200.114", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:a1:8c", "MAC (NIC-1) enp031f6": "74:86:e2:13:a2:16"}}
B1-113-1	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:62:23", "MAC (NIC-1) enp031f6": "74:86:e2:13:62:7e"}}
B1-113-2	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:ad:fb", "MAC (NIC-1) enp031f6": "74:86:e2:13:ae:c5"}}
B1-113-3	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8a:cb", "MAC (NIC-1) enp031f6": "74:86:e2:13:8b:69"}}
B1-113-4	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:f5", "MAC (NIC-1) enp031f6": "74:86:e2:13:b4:60"}}
B1-113-5	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:8c:b2", "MAC (NIC-1) enp031f6": "74:86:e2:13:8d:63"}}
B1-113-6	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:92:79", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:f1"}}
B1-113-7	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:b1:c7", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:78"}}
B1-113-8	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:92:1b", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:b9"}}
B1-113-9	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:89:ec", "MAC (NIC-1) enp031f6": "74:86:e2:13:8a:b5"}}
B1-113-10	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:07", "MAC (NIC-1) enp031f6": "74:86:e2:13:b2:c9"}}
B1-113-11	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:67:f8", "MAC (NIC-1) enp031f6": "74:86:e2:10:6a:8a"}}
B1-113-12	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:6a", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:f4"}}
B1-113-13	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:78", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:19"}}
B1-113-14	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:91:9b", "MAC (NIC-1) enp031f6": "74:86:e2:13:92:2c"}}
B1-113-15	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:10:20:49", "MAC (NIC-1) enp031f6": "74:86:e2:10:21:9a"}}
B1-113-16	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "c8:f7:50:f8:08:03", "MAC (NIC-1) enp031f6": "c8:f7:50:f8:09:2d"}}
B1-113-17	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9c:16", "MAC (NIC-1) enp031f6": "74:86:e2:13:9c:dd"}}
B1-113-18	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:87:75", "MAC (NIC-1) enp031f6": "74:86:e2:13:88:74"}}
B1-113-19	{"IP": "Y", "PDU IP": "10.10.200.115", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9b:9b", "MAC (NIC-1) enp031f6": "74:86:e2:13:9c:66"}}
B1-113-20	{"IP": "Y", "PDU IP": "10.10.200.116", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "74:86:e2:13:9d:10", "MAC (NIC-1) enp031f6": "74:86:e2:13:9d:d2"}}
B2-121-1	{"IP": "10.10.121.1", "PDU IP": "10.10.200.121", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:78", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:77"}}
B2-121-2	{"IP": "10.10.121.2", "PDU IP": "10.10.200.122", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:b1", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:b0"}}
B2-121-3	{"IP": "10.10.121.3", "PDU IP": "10.10.200.121", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e2:27", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e2:26"}}
B2-121-4	{"IP": "10.10.121.4", "PDU IP": "10.10.200.122", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:d2", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:d1"}}
B2-121-5	{"IP": "10.10.121.5", "PDU IP": "10.10.200.121", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:92:bc", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:92:bb"}}
B2-121-6	{"IP": "10.10.121.6", "PDU IP": "10.10.200.122", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:ea", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:e9"}}
B2-121-7	{"IP": "10.10.121.7", "PDU IP": "10.10.200.121", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:dc", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:db"}}
B2-121-8	{"IP": "10.10.121.8", "PDU IP": "10.10.200.122", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
B2-121-9	{"IP": "10.10.121.9", "PDU IP": "10.10.200.121", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e2:88", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e2:87"}}
B2-121-10	{"IP": "10.10.121.10", "PDU IP": "10.10.200.122", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:ec", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:eb"}}
B2-121-11	{"IP": "10.10.121.11", "PDU IP": "10.10.200.121", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:28", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:27"}}
B2-121-12	{"IP": "10.10.121.12", "PDU IP": "10.10.200.122", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:94:06", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:94:05"}}
B2-121-13	{"IP": "10.10.121.13", "PDU IP": "10.10.200.121", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:97", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:96"}}
B2-121-14	{"IP": "10.10.121.14", "PDU IP": "10.10.200.122", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f1:d1", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f1:d0"}}
B2-121-15	{"IP": "10.10.121.15", "PDU IP": "10.10.200.121", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e1:ab:fe", "MAC (NIC-1) enp031f6": "80:e8:2c:e1:ab:fd"}}
B2-121-16	{"IP": "10.10.121.16", "PDU IP": "10.10.200.122", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f5:49", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f5:48"}}
B2-121-17	{"IP": "10.10.121.17", "PDU IP": "10.10.200.121", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f0:ba", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f0:b9"}}
B2-121-18	{"IP": "10.10.121.18", "PDU IP": "10.10.200.122", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:6b", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:6a"}}
B2-121-19	{"IP": "10.10.121.19", "PDU IP": "10.10.200.121", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:91:dd", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:91:dc"}}
B2-121-20	{"IP": "10.10.121.20", "PDU IP": "10.10.200.122", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:3f", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:3e"}}
B2-122-1	{"IP": "10.10.122.1", "PDU IP": "10.10.200.123", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f1:7f", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f1:7e"}}
B2-122-2	{"IP": "10.10.122.2", "PDU IP": "10.10.200.124", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f0:fa", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f0:f9"}}
B2-122-3	{"IP": "10.10.122.3", "PDU IP": "10.10.200.123", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:90:76", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:90:75"}}
B2-122-4	{"IP": "10.10.122.4", "PDU IP": "10.10.200.124", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f0:99", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f0:98"}}
B2-122-5	{"IP": "10.10.122.5", "PDU IP": "10.10.200.123", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:2c", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:2b"}}
B2-122-6	{"IP": "10.10.122.6", "PDU IP": "10.10.200.124", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:bb", "MAC (NIC-1) enp031f6": "80:E8:2C:E2:DF:BA"}}
B2-122-7	{"IP": "10.10.122.7", "PDU IP": "10.10.200.123", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:f9", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:f8"}}
B2-122-8	{"IP": "10.10.122.8", "PDU IP": "10.10.200.124", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:8d:8b", "MAC (NIC-1) enp031f6": "80:E8:2C:E2:8D:8A"}}
B2-122-9	{"IP": "10.10.122.9", "PDU IP": "10.10.200.123", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ca:bf", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ca:be"}}
B2-122-10	{"IP": "10.10.122.10", "PDU IP": "10.10.200.124", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:45", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:44"}}
B2-122-11	{"IP": "10.10.122.11", "PDU IP": "10.10.200.123", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:94:3a", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:94:39"}}
B2-122-12	{"IP": "10.10.122.12", "PDU IP": "10.10.200.124", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:96:04", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:96:03"}}
B2-122-13	{"IP": "10.10.122.13", "PDU IP": "10.10.200.123", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:29", "MAC (NIC-1) enp031f6": "80:E8:2C:E2:DF:28"}}
B2-122-14	{"IP": "10.10.122.14", "PDU IP": "10.10.200.124", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:87", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:86"}}
B2-122-15	{"IP": "10.10.122.15", "PDU IP": "10.10.200.123", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:91:78", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:91:77"}}
B2-122-16	{"IP": "10.10.122.16", "PDU IP": "10.10.200.124", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:92:c1", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:92:c0"}}
B2-122-17	{"IP": "10.10.122.17", "PDU IP": "10.10.200.123", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
B2-122-18	{"IP": "10.10.122.18", "PDU IP": "10.10.200.124", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:8f:76", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:8f:75"}}
B2-122-19	{"IP": "10.10.122.19", "PDU IP": "10.10.200.123", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e1:e9:18", "MAC (NIC-1) enp031f6": "80:e8:2c:e1:e9:17"}}
B2-122-20	{"IP": "10.10.122.20", "PDU IP": "10.10.200.124", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:91:0f", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:91:0e"}}
B2-123-1	{"IP": "10.10.123.1", "PDU IP": "10.10.200.125", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:8e", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:8d"}}
B2-123-2	{"IP": "10.10.123.2", "PDU IP": "10.10.200.126", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:c8:29", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:c8:28"}}
B2-123-3	{"IP": "10.10.123.3", "PDU IP": "10.10.200.125", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:8f:4e", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:8f:4d"}}
B2-123-4	{"IP": "10.10.123.4", "PDU IP": "10.10.200.126", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e2:07", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e2:06"}}
B2-123-5	{"IP": "10.10.123.5", "PDU IP": "10.10.200.125", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:89", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:88"}}
B2-123-6	{"IP": "10.10.123.6", "PDU IP": "10.10.200.126", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f2:61", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f2:60"}}
B2-123-7	{"IP": "10.10.123.7", "PDU IP": "10.10.200.125", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:58", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:57"}}
B2-123-8	{"IP": "10.10.123.8", "PDU IP": "10.10.200.126", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:e5", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:e4"}}
B2-123-9	{"IP": "10.10.123.9", "PDU IP": "10.10.200.125", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e2:79", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e2:78"}}
B2-123-10	{"IP": "10.10.123.10", "PDU IP": "10.10.200.126", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:f7", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:f6"}}
B2-123-11	{"IP": "10.10.123.11", "PDU IP": "10.10.200.125", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e2:02", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e2:01"}}
B2-123-12	{"IP": "10.10.123.12", "PDU IP": "10.10.200.126", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:f1", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:f0"}}
B2-123-13	{"IP": "10.10.123.13", "PDU IP": "10.10.200.125", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e0:26:94", "MAC (NIC-1) enp031f6": "80:e8:2c:e0:26:93"}}
B2-123-14	{"IP": "10.10.123.14", "PDU IP": "10.10.200.126", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:dd:d7", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:dd:d6"}}
B2-123-15	{"IP": "10.10.123.15", "PDU IP": "10.10.200.125", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f4:c0", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f4:bf"}}
B2-123-16	{"IP": "10.10.123.16", "PDU IP": "10.10.200.126", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:d7", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:d6"}}
B2-123-17	{"IP": "10.10.123.17", "PDU IP": "10.10.200.125", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f3:55", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f3:54"}}
B2-123-18	{"IP": "10.10.123.18", "PDU IP": "10.10.200.126", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f2:1f", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f2:1e"}}
B2-123-19	{"IP": "10.10.123.19", "PDU IP": "10.10.200.125", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:33", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:32"}}
B2-123-20	{"IP": "10.10.123.20", "PDU IP": "10.10.200.126", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:c7:8d", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:c7:8c"}}
B2-124-1	{"IP": "10.10.124.1", "PDU IP": "10.10.200.127", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f1:a3", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f1:a2"}}
B2-124-2	{"IP": "10.10.124.2", "PDU IP": "10.10.200.128", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:91:29", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:91:28"}}
B2-124-3	{"IP": "10.10.124.3", "PDU IP": "10.10.200.127", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f6:29", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f6:28"}}
B2-124-4	{"IP": "10.10.124.4", "PDU IP": "10.10.200.128", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:95:d1", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:95:d0"}}
B2-124-5	{"IP": "10.10.124.5", "PDU IP": "10.10.200.127", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f5:ff", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f5:fe"}}
B2-124-6	{"IP": "10.10.124.6", "PDU IP": "10.10.200.128", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f0:e9", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f0:e8"}}
B2-124-7	{"IP": "10.10.124.7", "PDU IP": "10.10.200.127", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:92:ea", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:92:e9"}}
B2-124-8	{"IP": "10.10.124.8", "PDU IP": "10.10.200.128", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f3:4e", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f3:4d"}}
B2-124-9	{"IP": "10.10.124.9", "PDU IP": "10.10.200.127", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:de:be", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:de:bd"}}
B2-124-10	{"IP": "10.10.124.10", "PDU IP": "10.10.200.128", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:93", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:92"}}
B2-124-11	{"IP": "10.10.124.11", "PDU IP": "10.10.200.127", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f5:6d", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f5:6c"}}
B2-124-12	{"IP": "10.10.124.12", "PDU IP": "10.10.200.128", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f3:9a", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f3:99"}}
B2-124-13	{"IP": "10.10.124.13", "PDU IP": "10.10.200.127", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f1:51", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f1:50"}}
B2-124-14	{"IP": "10.10.124.14", "PDU IP": "10.10.200.128", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:96:0a", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:96:09"}}
B2-124-15	{"IP": "10.10.124.15", "PDU IP": "10.10.200.127", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e0:05", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e0:04"}}
B2-124-16	{"IP": "10.10.124.16", "PDU IP": "10.10.200.128", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e0:19:37", "MAC (NIC-1) enp031f6": "80:e8:2c:e0:19:36"}}
B2-124-17	{"IP": "10.10.124.17", "PDU IP": "10.10.200.127", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:a0:ff", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:a0:fe"}}
B2-124-18	{"IP": "10.10.124.18", "PDU IP": "10.10.200.128", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:3e", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:3d"}}
B2-124-19	{"IP": "10.10.124.19", "PDU IP": "10.10.200.127", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f1:27", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f1:26"}}
B2-124-20	{"IP": "10.10.124.20", "PDU IP": "10.10.200.128", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:90:63", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:90:62"}}
B2-125-1	{"IP": "10.10.125.1", "PDU IP": "10.10.200.129", "PDU Port": "1", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:e3", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:e2"}}
B2-125-2	{"IP": "10.10.125.2", "PDU IP": "10.10.200.130", "PDU Port": "2", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:c2", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:c1"}}
B2-125-3	{"IP": "10.10.125.3", "PDU IP": "10.10.200.129", "PDU Port": "3", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:af:40", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:af:3f"}}
B2-125-4	{"IP": "10.10.125.4", "PDU IP": "10.10.200.130", "PDU Port": "4", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
B2-125-5	{"IP": "10.10.125.5", "PDU IP": "10.10.200.129", "PDU Port": "5", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "", "MAC (NIC-1) enp031f6": ""}}
B2-125-6	{"IP": "10.10.125.6", "PDU IP": "10.10.200.130", "PDU Port": "6", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:dd:87", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:dd:86"}}
B2-125-7	{"IP": "10.10.125.7", "PDU IP": "10.10.200.129", "PDU Port": "7", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:46", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:45"}}
B2-125-8	{"IP": "10.10.125.8", "PDU IP": "10.10.200.130", "PDU Port": "22", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:ac", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:ab"}}
B2-125-9	{"IP": "10.10.125.9", "PDU IP": "10.10.200.129", "PDU Port": "9", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:df:d7", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:df:d6"}}
B2-125-10	{"IP": "10.10.125.10", "PDU IP": "10.10.200.130", "PDU Port": "10", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:8e:4f", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:8e:4e"}}
B2-125-11	{"IP": "10.10.125.11", "PDU IP": "10.10.200.129", "PDU Port": "11", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f5:39", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f5:38"}}
B2-125-12	{"IP": "10.10.125.12", "PDU IP": "10.10.200.130", "PDU Port": "12", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:d7:d9", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:d7:d8"}}
B2-125-13	{"IP": "10.10.125.13", "PDU IP": "10.10.200.129", "PDU Port": "13", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f5:2a", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f5:29"}}
B2-125-14	{"IP": "10.10.125.14", "PDU IP": "10.10.200.130", "PDU Port": "14", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:e1:18", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:e1:17"}}
B2-125-15	{"IP": "10.10.125.15", "PDU IP": "10.10.200.129", "PDU Port": "15", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:bb:75", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:bb:74"}}
B2-125-16	{"IP": "10.10.125.16", "PDU IP": "10.10.200.130", "PDU Port": "23", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f4:d2", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f4:d1"}}
B2-125-17	{"IP": "10.10.125.17", "PDU IP": "10.10.200.129", "PDU Port": "17", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e0:27:f0", "MAC (NIC-1) enp031f6": "80:e8:2c:e0:27:ef"}}
B2-125-18	{"IP": "10.10.125.18", "PDU IP": "10.10.200.130", "PDU Port": "18", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:f4:e9", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:f4:e8"}}
B2-125-19	{"IP": "10.10.125.19", "PDU IP": "10.10.200.129", "PDU Port": "19", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:d4:74", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:d4:73"}}
B2-125-20	{"IP": "10.10.125.20", "PDU IP": "10.10.200.130", "PDU Port": "20", "ethernet_interfaces": {"MAC (NIC-2) enp2s0": "80:e8:2c:e2:ea:fc", "MAC (NIC-1) enp031f6": "80:e8:2c:e2:ea:fb"}}
\.


--
-- TOC entry 3394 (class 0 OID 16426)
-- Dependencies: 218
-- Data for Name: login_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_methods (login_id, user_id, login_method, login_identifier) FROM stdin;
1	1	username	bradenacurtis801
2	1	gmail	bradenacurtis801@gmail.com
3	1	phone_number	3853352143
\.


--
-- TOC entry 3395 (class 0 OID 16439)
-- Dependencies: 219
-- Data for Name: machine_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.machine_status (machine_id, status) FROM stdin;
\.


--
-- TOC entry 3392 (class 0 OID 16411)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, phone_number, password_hash, status, role) FROM stdin;
1	bradenacurtis801	bradenacurtis801@gmail.com	3853352143	\N	pending	user
3	test_user	test@example.com	\N	hashed_password	pending	user
\.


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 220
-- Name: approvals_approval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approvals_approval_id_seq', 1, true);


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 217
-- Name: login_methods_login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_methods_login_id_seq', 3, true);


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- TOC entry 3242 (class 2606 OID 16454)
-- Name: approvals approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_pkey PRIMARY KEY (approval_id);


--
-- TOC entry 3244 (class 2606 OID 16472)
-- Name: dc02_hardware dc02_hardware_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dc02_hardware
    ADD CONSTRAINT dc02_hardware_pkey PRIMARY KEY (machine_id);


--
-- TOC entry 3236 (class 2606 OID 16431)
-- Name: login_methods login_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_methods
    ADD CONSTRAINT login_methods_pkey PRIMARY KEY (login_id);


--
-- TOC entry 3238 (class 2606 OID 16433)
-- Name: login_methods login_methods_user_id_login_method_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_methods
    ADD CONSTRAINT login_methods_user_id_login_method_key UNIQUE (user_id, login_method);


--
-- TOC entry 3240 (class 2606 OID 16445)
-- Name: machine_status machine_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machine_status
    ADD CONSTRAINT machine_status_pkey PRIMARY KEY (machine_id);


--
-- TOC entry 3228 (class 2606 OID 16422)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3230 (class 2606 OID 16424)
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- TOC entry 3232 (class 2606 OID 16418)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3234 (class 2606 OID 16420)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3246 (class 2606 OID 16460)
-- Name: approvals approvals_admin_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3247 (class 2606 OID 16455)
-- Name: approvals approvals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3245 (class 2606 OID 16434)
-- Name: login_methods login_methods_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_methods
    ADD CONSTRAINT login_methods_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2024-03-31 14:23:31

--
-- PostgreSQL database dump complete
--

