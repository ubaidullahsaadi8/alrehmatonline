--
-- PostgreSQL database dump
--

\restrict 5cSf53szIY0avg0KUZsdmWS53dt10fqRA1SYeWs18KX6zD1r6Y9LqdEWXetKSZc

-- Dumped from database version 17.5 (6bc9ef8)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO neondb_owner;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: bank_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bank_details (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    bank_name character varying(255) NOT NULL,
    account_holder_name character varying(255) NOT NULL,
    account_number character varying(100) NOT NULL,
    routing_number character varying(50),
    swift_code character varying(20),
    iban character varying(50),
    bank_address text,
    currency character varying(10) DEFAULT 'USD'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bank_details OWNER TO neondb_owner;

--
-- Name: class_meetings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.class_meetings (
    id character varying(255) NOT NULL,
    class_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    meeting_link text NOT NULL,
    meeting_date date NOT NULL,
    meeting_time character varying(50) NOT NULL,
    duration integer DEFAULT 60,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.class_meetings OWNER TO neondb_owner;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.classes (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    instructor_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.classes OWNER TO neondb_owner;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.contact_messages (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    phone text,
    read boolean DEFAULT false
);


ALTER TABLE public.contact_messages OWNER TO neondb_owner;

--
-- Name: course_bank_details; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_bank_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id character varying(255) NOT NULL,
    bank_name character varying(255),
    account_title character varying(255),
    account_number character varying(100),
    iban character varying(100),
    branch_code character varying(50),
    payment_instructions text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.course_bank_details OWNER TO neondb_owner;

--
-- Name: course_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_bookings (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    date date NOT NULL,
    "time" text NOT NULL,
    message text,
    course_id text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.course_bookings OWNER TO neondb_owner;

--
-- Name: course_installments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_installments (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_course_id text NOT NULL,
    installment_number integer NOT NULL,
    amount numeric NOT NULL,
    due_date date,
    status character varying(20) DEFAULT 'pending'::character varying,
    paid_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.course_installments OWNER TO neondb_owner;

--
-- Name: course_instructors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_instructors (
    id text DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    assigned_at timestamp(6) without time zone DEFAULT now(),
    status text DEFAULT 'active'::text,
    role text DEFAULT 'instructor'::text
);


ALTER TABLE public.course_instructors OWNER TO neondb_owner;

--
-- Name: course_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id text NOT NULL,
    instructor_id text,
    student_id text,
    message text NOT NULL,
    message_type text DEFAULT 'announcement'::text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.course_messages OWNER TO neondb_owner;

--
-- Name: course_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_notifications (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.course_notifications OWNER TO neondb_owner;

--
-- Name: course_payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_payments (
    id text NOT NULL,
    user_course_id text NOT NULL,
    amount numeric NOT NULL,
    payment_date timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_method text DEFAULT 'cash'::text NOT NULL,
    reference text,
    notes text,
    created_by text NOT NULL
);


ALTER TABLE public.course_payments OWNER TO neondb_owner;

--
-- Name: course_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.course_requests (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    message text NOT NULL,
    course_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.course_requests OWNER TO neondb_owner;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image text NOT NULL,
    price numeric NOT NULL,
    duration text NOT NULL,
    level text NOT NULL,
    instructor text NOT NULL,
    category text NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    instructor_id text,
    meeting_link text,
    meeting_time text,
    meeting_date date,
    status character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE public.courses OWNER TO neondb_owner;

--
-- Name: fee_plan_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.fee_plan_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_course_id text NOT NULL,
    student_id uuid NOT NULL,
    course_id character varying(255) NOT NULL,
    fee_type character varying(50) NOT NULL,
    total_fee numeric(10,2),
    monthly_amount numeric(10,2),
    installments_count integer,
    paid_amount numeric(10,2) DEFAULT 0,
    currency character varying(10) DEFAULT 'USD'::character varying,
    status character varying(50),
    installments_data jsonb,
    monthly_fees_data jsonb,
    payments_data jsonb,
    archived_at timestamp without time zone DEFAULT now(),
    archived_reason character varying(255) DEFAULT 'Fee plan updated'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.fee_plan_history OWNER TO neondb_owner;

--
-- Name: fee_plans; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.fee_plans (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    fee_type character varying(20) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    monthly_amount numeric(10,2),
    installments_count integer DEFAULT 1,
    installment_amount numeric(10,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bank_details_id text,
    payment_instructions text,
    CONSTRAINT fee_plans_fee_type_check CHECK (((fee_type)::text = ANY ((ARRAY['monthly'::character varying, 'full_course'::character varying])::text[]))),
    CONSTRAINT fee_plans_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.fee_plans OWNER TO neondb_owner;

--
-- Name: installment_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.installment_schedule (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    fee_plan_id text NOT NULL,
    installment_number integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    paid_date timestamp without time zone,
    payment_record_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT installment_schedule_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying])::text[])))
);


ALTER TABLE public.installment_schedule OWNER TO neondb_owner;

--
-- Name: instructor_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.instructor_messages (
    id text DEFAULT gen_random_uuid() NOT NULL,
    instructor_id text NOT NULL,
    student_id text,
    course_id text,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'message'::text,
    created_at timestamp(6) without time zone DEFAULT now(),
    read_by_student boolean DEFAULT false
);


ALTER TABLE public.instructor_messages OWNER TO neondb_owner;

--
-- Name: instructor_notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.instructor_notifications (
    id character varying(255) NOT NULL,
    instructor_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'message'::character varying,
    send_to_all boolean DEFAULT false,
    class_id character varying(255),
    student_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.instructor_notifications OWNER TO neondb_owner;

--
-- Name: instructor_payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.instructor_payments (
    id character varying(255) NOT NULL,
    instructor_id character varying(255) NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_type character varying(50) NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reference character varying(255),
    notes text,
    status character varying(50) DEFAULT 'completed'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.instructor_payments OWNER TO neondb_owner;

--
-- Name: instructor_salary; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.instructor_salary (
    id character varying(255) NOT NULL,
    instructor_id character varying(255) NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(255) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.instructor_salary OWNER TO neondb_owner;

-- 
-- Name: meeting_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.meeting_bookings (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    course_id text,
    service_id text,
    date date NOT NULL,
    "time" time(6) without time zone NOT NULL,
    message text,
    status text DEFAULT 'pending'::text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.meeting_bookings OWNER TO neondb_owner;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    from_user_id text NOT NULL,
    to_user_id text NOT NULL,
    subject character varying(255) NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO neondb_owner;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: monthly_fees; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.monthly_fees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_course_id text NOT NULL,
    month character varying(20) NOT NULL,
    year character varying(4) NOT NULL,
    amount numeric(10,2) NOT NULL,
    due_date date NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    paid_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.monthly_fees OWNER TO neondb_owner;

--
-- Name: notification_reads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification_reads (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    notification_id text NOT NULL,
    student_id text NOT NULL,
    read_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notification_reads OWNER TO neondb_owner;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text,
    link text,
    sender_id text,
    sender_type text DEFAULT 'admin'::text
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_history (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    fee_plan_id text NOT NULL,
    payment_record_id text,
    student_id text NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    action character varying(50) NOT NULL,
    amount numeric(10,2),
    previous_status character varying(20),
    new_status character varying(20),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payment_history OWNER TO neondb_owner;

--
-- Name: payment_records; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_records (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    fee_plan_id text NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_type character varying(20) NOT NULL,
    payment_method character varying(50),
    transaction_id text,
    status character varying(20) DEFAULT 'pending'::character varying,
    due_date date,
    paid_date timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_records_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['monthly'::character varying, 'installment'::character varying, 'full'::character varying])::text[]))),
    CONSTRAINT payment_records_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.payment_records OWNER TO neondb_owner;

--
-- Name: playing_with_neon; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.playing_with_neon (
    id integer NOT NULL,
    name text NOT NULL,
    value real
);


ALTER TABLE public.playing_with_neon OWNER TO neondb_owner;

--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.playing_with_neon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.playing_with_neon_id_seq OWNER TO neondb_owner;

--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.playing_with_neon_id_seq OWNED BY public.playing_with_neon.id;


--
-- Name: service_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_bookings (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    date date NOT NULL,
    "time" text NOT NULL,
    message text,
    service_id text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_bookings OWNER TO neondb_owner;

--
-- Name: service_payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_payments (
    id text NOT NULL,
    user_service_id text NOT NULL,
    amount numeric NOT NULL,
    payment_date timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_method text DEFAULT 'cash'::text NOT NULL,
    reference text,
    notes text,
    created_by text NOT NULL
);


ALTER TABLE public.service_payments OWNER TO neondb_owner;

--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.service_requests (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    service_id text,
    course_id text,
    message text NOT NULL,
    status text DEFAULT 'pending'::text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_requests OWNER TO neondb_owner;

--
-- Name: services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.services (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image text NOT NULL,
    features text[],
    price text NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO neondb_owner;

--
-- Name: student_classes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_classes (
    id character varying(255) NOT NULL,
    student_id character varying(255) NOT NULL,
    class_id character varying(255) NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE public.student_classes OWNER TO neondb_owner;

--
-- Name: student_courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_courses (
    id text NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    status text DEFAULT 'enrolled'::text NOT NULL,
    total_fee numeric,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    paid_amount numeric DEFAULT 0,
    due_date date,
    fee_type character varying(50),
    monthly_amount numeric,
    installments_count integer DEFAULT 1,
    currency character varying(10) DEFAULT 'USD'::character varying,
    payment_instructions text,
    enrollment_date timestamp without time zone DEFAULT now(),
    completion_date timestamp without time zone,
    meeting_link text,
    meeting_date date,
    meeting_time text
);


ALTER TABLE public.student_courses OWNER TO neondb_owner;

--
-- Name: student_enrollments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_enrollments (
    id text DEFAULT gen_random_uuid() NOT NULL,
    student_id text NOT NULL,
    course_id text NOT NULL,
    instructor_id text NOT NULL,
    enrolled_at timestamp(6) without time zone DEFAULT now(),
    status text DEFAULT 'active'::text,
    progress integer DEFAULT 0
);


ALTER TABLE public.student_enrollments OWNER TO neondb_owner;

--
-- Name: student_fees; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_fees (
    id text NOT NULL,
    student_id text NOT NULL,
    course_id text,
    amount numeric NOT NULL,
    discount integer DEFAULT 0,
    description text,
    due_date timestamp without time zone,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_fees OWNER TO neondb_owner;

--
-- Name: student_payments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_payments (
    id text NOT NULL,
    student_id text NOT NULL,
    fee_id text,
    amount numeric NOT NULL,
    method text NOT NULL,
    status text DEFAULT 'completed'::text,
    reference text,
    description text,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_payments OWNER TO neondb_owner;

--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscribers (
    id text NOT NULL,
    value text NOT NULL,
    type text NOT NULL,
    country_code text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    active boolean DEFAULT true
);


ALTER TABLE public.subscribers OWNER TO neondb_owner;

--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.testimonials (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    company text NOT NULL,
    content text NOT NULL,
    avatar text NOT NULL,
    rating integer NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.testimonials OWNER TO neondb_owner;

--
-- Name: user_services; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_services (
    id text NOT NULL,
    user_id text NOT NULL,
    service_id text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    start_date timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date timestamp(6) without time zone,
    total_fee numeric NOT NULL,
    paid_amount numeric DEFAULT 0 NOT NULL,
    due_date date,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_services OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    avatar text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    role text DEFAULT 'user'::text,
    active boolean DEFAULT true,
    phone text,
    whatsapp text,
    telegram text,
    secondary_email text,
    address text,
    notes text,
    last_login timestamp(6) without time zone,
    currency character varying(10) DEFAULT 'USD'::character varying,
    username character varying(255),
    user_type character varying(50) DEFAULT 'simple'::character varying,
    account_status character varying(50) DEFAULT 'active'::character varying,
    is_approved boolean DEFAULT false,
    country character varying(50),
    education text,
    member_type character varying(50) DEFAULT 'common'::character varying,
    notification_preferences jsonb DEFAULT '{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}'::jsonb,
    bio text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: playing_with_neon id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.playing_with_neon ALTER COLUMN id SET DEFAULT nextval('public.playing_with_neon_id_seq'::regclass);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, email, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e835072d-9351-479a-a5a3-3d554a0dba45	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2025-10-04 12:17:05.990965+00	20240614000000_course_requests_and_bookings	\N	\N	2025-10-04 12:17:04.455157+00	1
45c14836-1192-45ac-898d-81f8c8df9c97	aa7b9a04ae816c8c558f335f4ce45c49a1363a82abdea9d196dcbb2549d398e6	2025-10-04 12:18:00.468738+00	20251004121757_add_user_management_system	\N	\N	2025-10-04 12:17:59.035531+00	1
2c6a778b-e6ef-4178-b347-2d984cec0e19	469bbc76a24a7b7c66493325b2316bca6a71999413d6bdac5c854d45533d33c3	\N	20251004_add_currency_preference	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251004_add_currency_preference\n\nDatabase error code: 42701\n\nDatabase error:\nERROR: column "currency" of relation "users" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42701), message: "column \\"currency\\" of relation \\"users\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7478), routine: Some("check_for_column_name_collision") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251004_add_currency_preference"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251004_add_currency_preference"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:236	\N	2025-10-15 19:00:05.237374+00	0
\.


--
-- Data for Name: bank_details; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bank_details (id, bank_name, account_holder_name, account_number, routing_number, swift_code, iban, bank_address, currency, is_active, created_at, updated_at) FROM stdin;
9f665681-9a13-41a0-bb4b-cbbf3e711559	First National Bank	Education Institute LLC	1234567890	123456789	\N	\N	123 Main Street, New York, NY 10001	USD	t	2025-10-10 21:52:47.436166	2025-10-10 21:52:47.436166
f8760a41-9082-4c8e-9888-2cdeee833184	International Education Bank	Global Learning Center	9876543210	\N	EDUBANK001	US12EDUB0001234567890	456 Education Blvd, San Francisco, CA 94101	USD	t	2025-10-10 21:52:47.661914	2025-10-10 21:52:47.661914
\.


--
-- Data for Name: class_meetings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.class_meetings (id, class_id, title, description, meeting_link, meeting_date, meeting_time, duration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.classes (id, name, description, instructor_id, created_at, updated_at) FROM stdin;
ddabb2b5-b684-4197-81aa-f71fed4bc170	Advance typeScript Masterclass	lorem ispsum doller emit	1890e5ef-986b-435d-97bd-e306477d8246	2025-10-05 17:16:53.338205	2025-10-05 17:16:53.338205
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contact_messages (id, name, email, subject, message, created_at, phone, read) FROM stdin;
clqmh044odj2cmm5uxmc	2e12e 23r23r	sarom81060@exitbit.com	werwerw	wwewewdwdewcwecw	2025-10-21 05:17:26.923749	+25467668787	f
clqmh04nzwlzzt9km0jk	kufhiu4	admin@example.com	4r4rrr4r34	4r3r34r34r43r43r43r43	2025-10-21 05:32:27.98922	+25467668787	f
\.


--
-- Data for Name: course_bank_details; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_bank_details (id, course_id, bank_name, account_title, account_number, iban, branch_code, payment_instructions, created_at, updated_at) FROM stdin;
6aea77a5-3752-4c57-8b46-43e2859b74cb	course_1759592846908_g8dtw	JazzCash	Muhammad Wajid Ashraf	03232323232	\N	\N	3hejhfefu ewewgdewhjfgewhjfgwehjw	2025-10-18 04:25:29.424345	2025-10-18 04:25:29.424345
\.


--
-- Data for Name: course_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_bookings (id, name, email, phone, date, "time", message, course_id, status, created_at, updated_at) FROM stdin;
23a71602-815c-415a-bb25-c52acfcd7f00	eee	eee2@gmail.com	222221	2025-10-18	09:00	\N	course-react-2024	pending	2025-10-18 21:11:16.177259	2025-10-18 21:11:16.177259
\.


--
-- Data for Name: course_installments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_installments (id, user_course_id, installment_number, amount, due_date, status, paid_date, created_at) FROM stdin;
10692d39-ab8e-411d-9659-d55c08a62986	053cebf8-a4a8-42ac-a116-f08e81d3abc6	1	5000	2025-10-14	pending	\N	2025-10-14 20:34:39.489645
f7c5ca65-5bb4-4750-a70f-bec85570e31a	053cebf8-a4a8-42ac-a116-f08e81d3abc6	2	5000	2025-11-14	pending	\N	2025-10-14 20:34:39.731128
9a8b6552-a9f6-4dc3-a8e2-0498332fb2ef	053cebf8-a4a8-42ac-a116-f08e81d3abc6	3	5000	2025-12-14	pending	\N	2025-10-14 20:34:39.977107
d9f60854-dbd5-4945-8b48-6d55b9b456ce	053cebf8-a4a8-42ac-a116-f08e81d3abc6	4	5000	2026-01-14	pending	\N	2025-10-14 20:34:40.209097
086d1f59-f596-4b26-985d-491ad18f9698	30dfe242-0c89-47d9-a0df-ee2b5afb0b28	2	2500	2025-10-30	pending	\N	2025-10-20 05:49:11.742536
3ebb6587-c93b-453d-9c08-da3ae9f6566c	30dfe242-0c89-47d9-a0df-ee2b5afb0b28	1	2500	2025-10-25	paid	2025-10-20 05:51:57.519	2025-10-20 05:49:11.731687
768f8437-609a-481d-a22e-f4d2a8b5875e	f9b266b9-5447-4db0-8bff-a37289d4c6ab	1	5000	2025-10-23	pending	\N	2025-10-20 05:56:13.996396
bbada49b-1183-40d7-884f-4636464f426b	f9b266b9-5447-4db0-8bff-a37289d4c6ab	2	5000	2025-10-24	pending	\N	2025-10-20 05:56:14.001272
9b946274-1284-480a-83ce-aadd9fe3a890	enrollment-1760940014745-467	1	10000	2025-10-20	pending	\N	2025-10-20 06:03:02.134734
\.


--
-- Data for Name: course_instructors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_instructors (id, course_id, instructor_id, assigned_at, status, role) FROM stdin;
c8bb3187-07ce-465b-9938-df25c3de6460	course-web-development	instructor-sample-1	2025-10-10 20:34:16.606913	active	instructor
06fa9447-9948-4cff-aea9-2a53f47410ad	course-data-science	instructor-sample-1	2025-10-10 20:34:16.606913	active	instructor
68276e75-a864-472a-9dba-7be7120bb60b	course_1759592846908_g8dtw	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:10.984158	active	instructor
ccc6f704-b69a-48f0-9e13-319648375c7e	course-web-development	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:11.91152	active	instructor
0b67dd09-2142-421f-91d8-c362d6e6c9bf	course-data-science	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:13.196672	active	instructor
9e3538db-35b7-42b2-a3de-2b10b0578732	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	2025-10-14 04:32:33.019306	active	instructor
038ad05b-f077-4e01-bec4-dbf715fbf04a	course-node-advanced	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	2025-10-16 03:34:38.599198	active	instructor
7622a945-d58b-4fec-b9df-00440ca611f5	course-ai-ml	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	2025-10-16 04:29:22.889549	active	instructor
ae46bd37-40a4-4f43-ad23-e5efc07a8d05	course_1760939951174_fjcwi	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	2025-10-20 06:01:55.810483	active	instructor
\.


--
-- Data for Name: course_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_messages (id, course_id, instructor_id, student_id, message, message_type, is_read, created_at, updated_at) FROM stdin;
be675c70-9f5e-4689-9acb-bd51a134926c	course-web-development	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Welcome to the course! I am excited to have you on this learning journey. Please do not hesitate to ask questions and participate actively in our discussions.	announcement	f	2025-10-11 06:48:23.655497	2025-10-11 06:48:23.655497
dcea71b3-4fca-4158-81d0-68dae983381b	course-web-development	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Important: Please check the meeting schedule and join our weekly sessions. All course materials are available in the resources section. Assignment deadlines will be announced here.	announcement	f	2025-10-11 06:48:23.898048	2025-10-11 06:48:23.898048
caddf792-203e-44ed-9ae3-e8e4561743d8	course-web-development	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Great progress so far! Remember to practice regularly and reach out if you need any help. I am here to support your learning journey.	encouragement	f	2025-10-11 06:48:24.138577	2025-10-11 06:48:24.138577
f16ce5c4-410a-471c-8a91-74c53c4c33ff	course-data-science	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Welcome to the course! I am excited to have you on this learning journey. Please do not hesitate to ask questions and participate actively in our discussions.	announcement	f	2025-10-11 06:48:24.380577	2025-10-11 06:48:24.380577
fb4b1761-7ea8-49eb-9db1-b8a48f09a33b	course-data-science	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Important: Please check the meeting schedule and join our weekly sessions. All course materials are available in the resources section. Assignment deadlines will be announced here.	announcement	f	2025-10-11 06:48:24.620255	2025-10-11 06:48:24.620255
4f836d66-bec1-448c-a5aa-922931a6f18b	course-data-science	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Great progress so far! Remember to practice regularly and reach out if you need any help. I am here to support your learning journey.	encouragement	f	2025-10-11 06:48:24.877205	2025-10-11 06:48:24.877205
0fd8ba84-35e1-45bb-a4c5-507968d65bc2	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Welcome to the course! I am excited to have you on this learning journey. Please do not hesitate to ask questions and participate actively in our discussions.	announcement	f	2025-10-11 06:48:25.18702	2025-10-11 06:48:25.18702
932c2cdc-5be0-47b0-8398-2478e7edcd96	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Important: Please check the meeting schedule and join our weekly sessions. All course materials are available in the resources section. Assignment deadlines will be announced here.	announcement	f	2025-10-11 06:48:25.429053	2025-10-11 06:48:25.429053
abb83fe3-21a4-4d2b-b40a-77924f5eac4e	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	Great progress so far! Remember to practice regularly and reach out if you need any help. I am here to support your learning journey.	encouragement	f	2025-10-11 06:48:25.698079	2025-10-11 06:48:25.698079
\.


--
-- Data for Name: course_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_notifications (id, course_id, instructor_id, message, created_at) FROM stdin;
64a14293-8c89-4c20-9437-574a6aaa9d12	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	dmjgedeugewhgwd	2025-10-18 09:02:47.841104
3a5857ad-fd4a-47e3-ac5d-9b3a400b4e06	course_1759592846908_g8dtw	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	hi abubark i am wajid	2025-10-20 05:44:48.509519
\.


--
-- Data for Name: course_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_payments (id, user_course_id, amount, payment_date, payment_method, reference, notes, created_by) FROM stdin;
payment-1759594144759-907	enrollment-1759594144452-713	1000	2025-10-04 16:09:04.862796	cash	Initial payment	Initial payment at enrollment	cd19b09a-75cc-4ad4-aeab-f6274dbcadda
\.


--
-- Data for Name: course_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.course_requests (id, name, email, phone, message, course_id, status, created_at, updated_at) FROM stdin;
32849914-f904-4b24-a6f4-77e9e2ad1935	2e12e 23r23r	sara.ahmed@example.com	+25467668787	WQWEEQ	course-react-2024	pending	2025-10-21 04:46:43.360648	2025-10-21 04:46:43.360648
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.courses (id, title, description, image, price, duration, level, instructor, category, featured, created_at, updated_at, instructor_id, meeting_link, meeting_time, meeting_date, status) FROM stdin;
course-web-development	Full Stack Web Development	Learn to build modern web applications with React, Node.js, and databases	/images/web-dev.jpg	499.99	12 weeks	intermediate	John Smith	Programming	t	2025-10-10 20:34:16.157032	2025-10-10 20:34:16.157032	00e08db3-2fed-4677-b1e9-337a18be925d	https://meet.google.com/sample-meeting-link	14:00	2025-10-11	active
course-data-science	Data Science Fundamentals	Introduction to data analysis, statistics, and machine learning	/images/data-science.jpg	399.99	10 weeks	beginner	John Smith	Data Science	f	2025-10-10 20:34:16.386376	2025-10-10 20:34:16.386376	00e08db3-2fed-4677-b1e9-337a18be925d	https://meet.google.com/sample-meeting-link	14:00	2025-10-11	active
course-react-2024	Modern React Development 2024	Master React 18 with Hooks, Context, and Modern Best Practices	/placeholder.jpg	299.99	8 weeks	Intermediate		Web Development	t	2025-10-16 03:33:55.622	2025-10-16 03:33:55.622	\N	\N	\N	\N	active
course-ai-ml	AI and Machine Learning Fundamentals	Introduction to AI concepts and practical ML applications	/placeholder.jpg	499.99	12 weeks	Beginner		AI & ML	t	2025-10-16 03:33:56.482	2025-10-16 03:33:56.482	\N	\N	\N	\N	active
course-node-advanced	Advanced Node.js Development	Build scalable and performant server applications	/placeholder.jpg	399.99	10 weeks	Advanced		Backend Development	f	2025-10-16 03:33:56.234	2025-10-16 14:30:20.648743	\N	\N	09:33	\N	active
course_1759592846908_g8dtw	Advance typeScript Masterclass	lorem ispsum doller emit	/placeholder.jpg	5555	8	beginner	Wajid Ashraf	programming	f	2025-10-04 15:47:28.062391	2025-10-17 15:17:43.138461	00e08db3-2fed-4677-b1e9-337a18be925d	eeeee	11:07	2025-11-06	active
course_1760939951174_fjcwi	Apexvim developer	ewewewe wewe	/placeholder.jpg	10000	8	beginner	TBD	programming	f	2025-10-20 05:59:11.191239	2025-10-20 05:59:11.191239	\N	\N	\N	\N	active
\.


--
-- Data for Name: fee_plan_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.fee_plan_history (id, student_course_id, student_id, course_id, fee_type, total_fee, monthly_amount, installments_count, paid_amount, currency, status, installments_data, monthly_fees_data, payments_data, archived_at, archived_reason, created_at) FROM stdin;
cf59f509-9d7a-42e7-a119-a28f739510fe	bd1d3643-672a-451c-9b53-143ac947f4fd	98a92c53-6d0b-43b0-845f-373e8a5e18fc	course_1759592846908_g8dtw	monthly	50000.00	0.00	1	0.00	PKR	active	[]	[{"id": "4a001c16-c8af-4b1f-9ec6-2c76094dbcae", "year": "2025", "month": "march", "amount": "333.00", "status": "paid", "due_date": "2025-10-22T19:00:00.000Z", "paid_date": "2025-10-17T22:42:04.517Z", "created_at": "2025-10-17T22:41:59.240Z", "user_course_id": "bd1d3643-672a-451c-9b53-143ac947f4fd"}]	[]	2025-10-18 03:55:06.158239	Fee plan updated to monthly	2025-10-18 03:55:06.158239
6963b909-4f0d-45c3-bdd9-7af6f272ca6b	bd1d3643-672a-451c-9b53-143ac947f4fd	98a92c53-6d0b-43b0-845f-373e8a5e18fc	course_1759592846908_g8dtw	monthly	50000.00	0.00	1	0.00	PKR	active	[]	[{"id": "3366a32d-6f01-4a42-8cb9-f658b6ff5d83", "year": "2025", "month": "march", "amount": "3000.00", "status": "paid", "due_date": "2025-02-05T19:00:00.000Z", "paid_date": "2025-10-17T22:56:14.573Z", "created_at": "2025-10-17T22:56:04.121Z", "user_course_id": "bd1d3643-672a-451c-9b53-143ac947f4fd"}]	[]	2025-10-18 03:56:36.41221	Fee plan updated to monthly	2025-10-18 03:56:36.41221
\.


--
-- Data for Name: fee_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.fee_plans (id, student_id, course_id, instructor_id, fee_type, total_amount, monthly_amount, installments_count, installment_amount, currency, status, created_at, updated_at, bank_details_id, payment_instructions) FROM stdin;
51860bcc-858e-44ef-855b-69e3194d97a4	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course_1759592846908_g8dtw	00e08db3-2fed-4677-b1e9-337a18be925d	monthly	500.00	50.00	1	\N	USD	active	2025-10-10 21:43:13.759169	2025-10-10 21:43:13.759169	9f665681-9a13-41a0-bb4b-cbbf3e711559	Please include your student ID and course name in the payment reference.
888bc94c-826d-4016-a621-ce18feacc892	student-sample-1	course-web-development	00e08db3-2fed-4677-b1e9-337a18be925d	full_course	1200.00	\N	3	400.00	USD	active	2025-10-10 21:43:13.985426	2025-10-10 21:43:13.985426	f8760a41-9082-4c8e-9888-2cdeee833184	Use your full name and course code as payment reference. Allow 2-3 business days for processing.
\.


--
-- Data for Name: installment_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.installment_schedule (id, fee_plan_id, installment_number, amount, due_date, status, paid_date, payment_record_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: instructor_messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.instructor_messages (id, instructor_id, student_id, course_id, title, message, type, created_at, read_by_student) FROM stdin;
9b5fe706-a955-4ed0-9c7e-c4abc507dea4	instructor-sample-1	student-sample-1	course-web-development	Welcome to Web Development Course	Welcome to the Full Stack Web Development course! We'll be covering React, Node.js, and database integration. Please check the meeting link for our first session tomorrow.	message	2025-10-10 20:34:17.572718	f
8fb693aa-ae67-46a2-a8d5-c9012e035279	instructor-sample-1	student-sample-1	course-web-development	Welcome to Web Development Course	Welcome to the Full Stack Web Development course! We'll be covering React, Node.js, and database integration. Please check the meeting link for our first session tomorrow.	message	2025-10-10 20:34:42.251189	f
\.


--
-- Data for Name: instructor_notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.instructor_notifications (id, instructor_id, title, message, type, send_to_all, class_id, student_id, created_at) FROM stdin;
\.


--
-- Data for Name: instructor_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.instructor_payments (id, instructor_id, amount, payment_type, payment_method, payment_date, reference, notes, status, created_at, created_by, updated_at) FROM stdin;
\.


--
-- Data for Name: instructor_salary; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.instructor_salary (id, instructor_id, month, year, amount, status, payment_date, notes, created_at, created_by, updated_at) FROM stdin;
02ab2f20-b321-4a2e-b47c-8103e42f5938	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	10	2025	6999.00	paid	2025-10-18 12:52:47.684	\N	2025-10-18 12:52:24.509586	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	2025-10-18 12:52:47.228231
e95ce750-8e04-4afe-95eb-b13a1cf9f7fb	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	10	2025	3000.00	pending	\N	33333333	2025-10-18 19:07:07.49739	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	2025-10-18 19:07:07.49739
5e21e74a-11c8-470a-8cf9-1dbf598b6886	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	10	2025	3000.00	pending	\N	33333333	2025-10-18 19:14:55.473292	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	2025-10-18 19:14:55.473292
\.


--
-- Data for Name: meeting_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.meeting_bookings (id, name, email, phone, course_id, service_id, date, "time", message, status, created_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.messages (id, from_user_id, to_user_id, subject, content, read, created_at, updated_at) FROM stdin;
1	00e08db3-2fed-4677-b1e9-337a18be925d	c19ae49d-5368-440f-abb4-37dbb85e9ef1	Welcome to the course!	Hello! Welcome to our course. I am excited to have you as a student. Please feel free to reach out if you have any questions.	f	2025-10-10 21:26:35.866725	2025-10-10 21:26:35.866725
\.


--
-- Data for Name: monthly_fees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.monthly_fees (id, user_course_id, month, year, amount, due_date, status, paid_date, created_at) FROM stdin;
b29279df-df15-49f1-8a3c-256e04ecdfa8	053cebf8-a4a8-42ac-a116-f08e81d3abc6	february	2025	6000.00	2025-02-20	paid	2025-10-14 20:37:20.82	2025-10-14 20:35:59.918014
56f28ec7-9ffc-44c0-8aee-600d7bab9485	053cebf8-a4a8-42ac-a116-f08e81d3abc6	january	2026	3333.00	2025-05-23	pending	\N	2025-10-14 20:43:33.505615
0015fb77-8acc-42c3-a939-8634c1a13ed6	bd1d3643-672a-451c-9b53-143ac947f4fd	july	2025	4000.00	2025-07-03	paid	2025-10-18 04:07:49.022	2025-10-18 04:07:45.4498
4a4ba66d-fd83-4c4d-adf7-66bd9beb43ff	bd1d3643-672a-451c-9b53-143ac947f4fd	march	2025	6000.00	2025-02-20	paid	2025-10-18 05:29:08.927	2025-10-18 05:07:12.277603
\.


--
-- Data for Name: notification_reads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification_reads (id, notification_id, student_id, read_at) FROM stdin;
4c234322-16de-4477-a4d5-e04f9d324b50	64a14293-8c89-4c20-9437-574a6aaa9d12	98a92c53-6d0b-43b0-845f-373e8a5e18fc	2025-10-18 09:53:23.701284
56f594fb-6e21-4f26-a428-0578bdff9086	64a14293-8c89-4c20-9437-574a6aaa9d12	a9dd796c-b2e8-49c5-9948-90642cb7239e	2025-10-20 05:39:25.860135
dbe5de29-0a04-4cb2-93bb-e1e4d0727344	3a5857ad-fd4a-47e3-ac5d-9b3a400b4e06	a9dd796c-b2e8-49c5-9948-90642cb7239e	2025-10-20 05:45:29.675436
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notifications (id, user_id, title, message, type, read, created_at, created_by, link, sender_id, sender_type) FROM stdin;
c3029742-7f24-4c09-b709-745e54b76c6b	user-1759580360240783	Welcome to our platform	Thank you for joining our platform. We hope you enjoy our services!	success	f	2025-10-04 12:19:24.647	admin-system	\N	\N	admin
8103f1ef-3694-4daf-b62e-62860a463f01	user-1759580360240783	Complete your profile	Please complete your profile by adding your contact information.	info	f	2025-10-04 12:19:24.647	admin-system	/profile	\N	admin
59ebebf4-78cd-4390-b165-9e2692b91252	user-1759580360240783	Payment reminder	You have pending payments. Please check your enrollments.	warning	f	2025-10-04 12:19:24.647	admin-system	\N	\N	admin
6b5613a5-516a-4447-99b5-563536426d1c	user-1759580361264369	Welcome to our platform	Thank you for joining our platform. We hope you enjoy our services!	success	f	2025-10-04 12:19:26.08	admin-system	\N	\N	admin
352962e2-90be-42b6-bd34-f095df3372d6	user-1759580361264369	Complete your profile	Please complete your profile by adding your contact information.	info	f	2025-10-04 12:19:26.08	admin-system	/profile	\N	admin
af8751b3-917c-42a5-b2cd-56af05afb28f	user-1759580361264369	Payment reminder	You have pending payments. Please check your enrollments.	warning	f	2025-10-04 12:19:26.08	admin-system	\N	\N	admin
6d388c9b-64bf-4f74-8633-564ce30c013e	user-1759580362012327	Welcome to our platform	Thank you for joining our platform. We hope you enjoy our services!	success	f	2025-10-04 12:19:27.236	admin-system	\N	\N	admin
7cfeaeaf-414f-4edc-9dc0-2c74c9d7e032	user-1759580362012327	Complete your profile	Please complete your profile by adding your contact information.	info	f	2025-10-04 12:19:27.236	admin-system	/profile	\N	admin
ab75ece6-d6a6-4cce-867e-64a4bc8bcc88	user-1759580362012327	Payment reminder	You have pending payments. Please check your enrollments.	warning	f	2025-10-04 12:19:27.236	admin-system	\N	\N	admin
notif-1759582568395-592	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	rerer	rerer	info	t	2025-10-04 12:56:08.479631	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1760787544916-738	98a92c53-6d0b-43b0-845f-373e8a5e18fc	Notification from Advance typeScript Masterclass	gytytytyty	info	t	2025-10-18 11:39:05.289946	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760940014753-449	a9dd796c-b2e8-49c5-9948-90642cb7239e	New Course Enrollment	You have been enrolled in Apexvim developer. Check your courses section for details.	info	f	2025-10-20 06:00:14.760132	2e8433d7-2ce4-40b7-9e75-9bd242887b13	\N	\N	admin
notif-1759582568526-185	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	rerer	rerer	info	t	2025-10-04 12:56:08.619494	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759582568150-289	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	rerer	rerer	info	t	2025-10-04 12:56:08.872316	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759582569373-169	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	rerer	rerer	info	t	2025-10-04 12:56:09.455129	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759581780762-527	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	eee	eee	info	t	2025-10-04 12:43:01.351408	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759582220974-767	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	dddddd	ddd	info	t	2025-10-04 12:50:21.569673	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759582569092-397	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	rerer	rerer	info	t	2025-10-04 12:56:09.179352	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
notif-1759594145066-167	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	New Course Enrollment	You have been enrolled in Advance typeScript Masterclass. Check your courses section for details.	info	t	2025-10-04 16:09:05.477203	cd19b09a-75cc-4ad4-aeab-f6274dbcadda	\N	\N	admin
a4897886-6dad-446a-ab7d-be8d1873b88b	student-sample-1	Welcome to Web Development Course	Welcome to the Full Stack Web Development course! We'll be covering React, Node.js, and database integration. Please check the meeting link for our first session tomorrow.	message	f	2025-10-10 20:34:42.526665	instructor-sample-1	\N	instructor-sample-1	instructor
notif-1760781428514-3	98a92c53-6d0b-43b0-845f-373e8a5e18fc	jkghgjh	hgjhghjghgj	info	t	2025-10-18 09:57:11.12241	2e8433d7-2ce4-40b7-9e75-9bd242887b13	\N	\N	admin
notif-1760785163402-52	031e0e1d-37c1-4788-a034-113899ae2322	Notification from Advance typeScript Masterclass	33ee3e3e	info	f	2025-10-18 10:59:23.29663	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760785175528-416	e8db3f8e-9afc-4b8a-bdac-bba45007b568	Notification from Advance typeScript Masterclass	hbbjhbjh	info	f	2025-10-18 10:59:35.426052	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760785389088-29	031e0e1d-37c1-4788-a034-113899ae2322	Notification from Advance typeScript Masterclass	3232323232323	info	f	2025-10-18 11:03:08.982023	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760785597474-989	e8db3f8e-9afc-4b8a-bdac-bba45007b568	Notification from Advance typeScript Masterclass	uyttuytyt	info	f	2025-10-18 11:06:37.375122	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760786473891-886	031e0e1d-37c1-4788-a034-113899ae2322	Notification from Advance typeScript Masterclass	jhfhgfhg	info	f	2025-10-18 11:21:13.787075	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
notif-1760787224705-341	031e0e1d-37c1-4788-a034-113899ae2322	Notification from Advance typeScript Masterclass	jyffhg	info	f	2025-10-18 11:33:44.625566	b8faa774-726d-48ff-a1bb-02d9bfe4ff33	\N	\N	admin
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_history (id, fee_plan_id, payment_record_id, student_id, course_id, instructor_id, action, amount, previous_status, new_status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: payment_records; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_records (id, fee_plan_id, student_id, course_id, instructor_id, amount, payment_type, payment_method, transaction_id, status, due_date, paid_date, notes, created_at, updated_at) FROM stdin;
97657110-0c7a-450e-9455-c9a428becd24	51860bcc-858e-44ef-855b-69e3194d97a4	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course_1759592846908_g8dtw	00e08db3-2fed-4677-b1e9-337a18be925d	50.00	monthly	\N	\N	pending	2025-11-09	\N	\N	2025-10-10 21:43:14.212608	2025-10-10 21:43:14.212608
\.


--
-- Data for Name: playing_with_neon; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.playing_with_neon (id, name, value) FROM stdin;
1	c4ca4238a0	0.4681302
2	c81e728d9d	0.4959714
3	eccbc87e4b	0.4062304
4	a87ff679a2	0.3686942
5	e4da3b7fbb	0.25789338
6	1679091c5a	0.4391214
7	8f14e45fce	0.9999471
8	c9f0f895fb	0.9741601
9	45c48cce2e	0.024813995
10	d3d9446802	0.60532033
\.


--
-- Data for Name: service_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_bookings (id, name, email, phone, date, "time", message, service_id, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: service_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_payments (id, user_service_id, amount, payment_date, payment_method, reference, notes, created_by) FROM stdin;
\.


--
-- Data for Name: service_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.service_requests (id, name, email, phone, service_id, course_id, message, status, created_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.services (id, title, description, image, features, price, featured, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: student_classes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_classes (id, student_id, class_id, joined_at, status) FROM stdin;
\.


--
-- Data for Name: student_courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_courses (id, student_id, course_id, status, total_fee, created_at, updated_at, paid_amount, due_date, fee_type, monthly_amount, installments_count, currency, payment_instructions, enrollment_date, completion_date, meeting_link, meeting_date, meeting_time) FROM stdin;
c1a855e9-5b52-4206-be99-d8b444bf11e0	fd8bba00-f76d-4358-b2d1-99409cebddb1	course-web-development	pending	499.99	2025-10-11 06:22:57.508695	2025-10-11 06:22:57.508695	0	\N	\N	\N	1	USD	\N	2025-10-15 19:38:17.175086	\N	\N	\N	\N
73b81218-6d38-4d6a-8db2-82d529436948	fd8bba00-f76d-4358-b2d1-99409cebddb1	course-data-science	pending	399.99	2025-10-11 06:24:19.341284	2025-10-11 06:24:19.341284	0	\N	\N	\N	1	USD	\N	2025-10-15 19:38:17.175086	\N	\N	\N	\N
eb7f19fe-8e63-4caa-a69e-e98ffa6f70b7	fd8bba00-f76d-4358-b2d1-99409cebddb1	course_1759592846908_g8dtw	pending	\N	2025-10-11 06:25:08.841261	2025-10-11 06:25:08.841261	\N	\N	\N	\N	\N	USD	\N	2025-10-15 19:38:17.175086	\N	\N	\N	\N
796b4960-6783-484b-a803-57675fb85a3c	e8db3f8e-9afc-4b8a-bdac-bba45007b568	course_1759592846908_g8dtw	active	\N	2025-10-15 19:39:57.354	2025-10-18 05:03:45.213646	\N	\N	\N	\N	\N	USD	\N	2025-10-15 19:39:57.351	\N	123334567890	2025-11-06	21:16
bd1d3643-672a-451c-9b53-143ac947f4fd	98a92c53-6d0b-43b0-845f-373e8a5e18fc	course_1759592846908_g8dtw	active	50000	2025-10-15 04:25:14.227899	2025-10-18 05:03:45.213646	0	\N	monthly	0	1	USD	\N	2025-10-15 19:38:17.175086	\N	123334567890	2025-11-06	21:16
19cbed9e-bad1-422e-b917-aed948ab1a18	031e0e1d-37c1-4788-a034-113899ae2322	course_1759592846908_g8dtw	pending	0	2025-10-15 04:39:41.458939	2025-10-18 10:51:12.820138	0	\N	monthly	0	1	USD	\N	2025-10-15 19:38:17.175086	\N	\N	\N	\N
9dd45b1b-cb04-436b-83a9-06f0d7c607e0	98a92c53-6d0b-43b0-845f-373e8a5e18fc	course-ai-ml	enrolled	0	2025-10-18 12:48:09.637901	2025-10-18 12:48:09.637901	0	\N	\N	\N	1	USD	\N	2025-10-18 12:48:09.637901	\N	\N	\N	\N
723d2043-f04f-42b1-b167-a891c4b2ce9b	a9dd796c-b2e8-49c5-9948-90642cb7239e	course-node-advanced	enrolled	0	2025-10-20 05:47:36.263037	2025-10-20 05:47:36.263037	0	\N	\N	\N	1	USD	\N	2025-10-20 05:47:36.263037	\N	\N	\N	\N
30dfe242-0c89-47d9-a0df-ee2b5afb0b28	a9dd796c-b2e8-49c5-9948-90642cb7239e	course_1759592846908_g8dtw	enrolled	5000	2025-10-20 05:38:19.994844	2025-10-20 05:49:11.702359	2500	\N	complete	0	2	USD	\N	2025-10-20 05:38:19.994844	\N	\N	\N	\N
f9b266b9-5447-4db0-8bff-a37289d4c6ab	a9dd796c-b2e8-49c5-9948-90642cb7239e	course-ai-ml	in_progress	10000	2025-10-20 05:46:57.617204	2025-10-20 05:56:13.977776	0	\N	complete	0	2	USD	\N	2025-10-20 05:46:57.617204	\N	\N	\N	\N
enrollment-1760940014745-467	a9dd796c-b2e8-49c5-9948-90642cb7239e	course_1760939951174_fjcwi	pending	10000	2025-10-20 06:00:14.748796	2025-10-20 06:03:02.119032	0	\N	complete	0	1	USD	\N	2025-10-20 06:00:14.748796	\N	\N	\N	\N
\.


--
-- Data for Name: student_enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_enrollments (id, student_id, course_id, instructor_id, enrolled_at, status, progress) FROM stdin;
feab2d71-06d2-48ba-bab5-d80a44dbfb88	student-sample-1	course-web-development	instructor-sample-1	2025-10-10 20:34:16.958886	active	25
2fcb6b20-2607-4455-916f-6f290db31afd	student-sample-1	course-data-science	instructor-sample-1	2025-10-10 20:34:16.958886	active	10
2c6e4cfd-a9ff-4fd3-896f-8f0afacd4e2f	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course_1759592846908_g8dtw	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:11.299766	active	17
1e380af0-7b92-45da-ae98-de3f94ae8380	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course-web-development	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:12.153854	active	73
3e8df91b-a476-47e2-8974-5da584fdbd66	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course-data-science	00e08db3-2fed-4677-b1e9-337a18be925d	2025-10-10 21:25:13.448375	active	98
\.


--
-- Data for Name: student_fees; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_fees (id, student_id, course_id, amount, discount, description, due_date, status, created_at, updated_at) FROM stdin;
8dd8cd84-4d8d-4c84-81af-1863ef0066e5	c19ae49d-5368-440f-abb4-37dbb85e9ef1	course_1759592846908_g8dtw	5555	0	Fee for Advance typeScript Masterclass	2025-11-04 20:32:01.427	pending	2025-10-05 15:32:01.565849	2025-10-05 15:32:01.565849
\.


--
-- Data for Name: student_payments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_payments (id, student_id, fee_id, amount, method, status, reference, description, date, created_at, updated_at) FROM stdin;
e23eda67-51b8-4378-adf5-60117f414aa2	c19ae49d-5368-440f-abb4-37dbb85e9ef1	8dd8cd84-4d8d-4c84-81af-1863ef0066e5	2777.5	credit_card	completed	REF-1759678322348	Payment for Advance typeScript Masterclass	2025-10-05 15:32:02.475797	2025-10-05 15:32:02.475797	2025-10-05 15:32:02.475797
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscribers (id, value, type, country_code, created_at, active) FROM stdin;
711f83b7-a50f-41ca-a1e3-8c02c33513e3	muhammadwajidashraf69@gmail.com	gmail	\N	2025-10-05 11:45:16.755	t
cde79d88-cdd1-4df8-b008-a92fd3dbdb84	923024540201	whatsapp	92	2025-10-05 11:45:45.902	t
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.testimonials (id, name, role, company, content, avatar, rating, featured, created_at) FROM stdin;
1dab349e-1108-4219-ad57-733221b1d470	Waqas Sharif	CEO	Apexvim	Partnering with Hatbrain was one of the best decisions we've made. Their team delivered a custom software solution that streamlined our entire operations. From day one, they understood our industry needs and executed flawlessly. We’re now faster, more efficient, and better equipped for growth.	/placeholder-user.jpg	5	f	2025-10-04 20:09:05.751616
87311e42-de4e-4108-a97b-9b9b74b7ee25	Waqar ul Zafar	CEO	Craveteck	Hatbrain’s technical expertise is unmatched. Their developers aren't just coders—they’re strategic problem-solvers. They helped us scale our backend infrastructure to handle triple the traffic, all while improving stability and reducing costs. I’d recommend them without hesitation.	/placeholder-user.jpg	5	f	2025-10-04 20:10:07.125127
616f8050-1b52-4e15-ae95-6fee440605cf	Rida Nasir	Project Manager	Stardust Dev	We brought Hatbrain in during a critical phase of our product development. They came through with scalable, user-friendly features that elevated our learning platform. Communication was clear, timelines were met, and the final product exceeded expectations.	/placeholder-user.jpg	5	f	2025-10-04 20:24:01.573672
4c8b8dfe-3bd0-42f0-8f4d-4347bc04053f	Muhammad Ali	HR	Cipher Dev	Hatbrain was instrumental in building our mobile payment solution. Their agile approach and constant innovation made the collaboration feel seamless. What stood out most was their genuine investment in our success—they acted like true partners, not just a vendor.	/placeholder-user.jpg	5	f	2025-10-04 20:25:06.092583
2c61cd6e-88cc-4702-90fe-8289f7084275	Zain Ali	Graphic Designer	Al Mawrid	From UX design to backend development, Hatbrain delivered end-to-end software that helped us digitize our retail operations. Their ability to quickly understand our needs and turn them into a functional, beautiful product is impressive. We're already planning our next project with them.	/placeholder-user.jpg	5	f	2025-10-04 20:26:18.697345
\.


--
-- Data for Name: user_services; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_services (id, user_id, service_id, status, start_date, end_date, total_fee, paid_amount, due_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, password, name, avatar, created_at, updated_at, role, active, phone, whatsapp, telegram, secondary_email, address, notes, last_login, currency, username, user_type, account_status, is_approved, country, education, member_type, notification_preferences, bio) FROM stdin;
user-1759580360240783	user1@example.com	$2b$10$KiFMaypOVhPKm9dt101NHuJTZtkk0wHHuqBuGBCpvYCopkUWVIXtm	Sample User user1	\N	2025-10-04 12:19:20.488	2025-10-04 12:19:20.488	user	t	+1234567890	+1234567890	@useruser1	secondary.user1@example.com	\N	\N	\N	USD	\N	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
user-1759580361264369	user2@example.com	$2b$10$WGaqi87r4J7KYsl2/tUGSeKx6lHyVwgdyIc.VN0wR7158qCjjDsS.	Sample User user2	\N	2025-10-04 12:19:21.492	2025-10-04 12:19:21.492	user	t	+1234567890	+1234567890	@useruser2	secondary.user2@example.com	\N	\N	\N	USD	\N	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
user-1759580362012327	user3@example.com	$2b$10$kSHeJ08fTLkgH6PRXOPmhu6f7uIZQEl.RjacwLxl9BM/PxFliVSve	Sample User user3	\N	2025-10-04 12:19:22.17	2025-10-04 12:19:22.17	user	t	+1234567890	+1234567890	@useruser3	secondary.user3@example.com	\N	\N	\N	USD	\N	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
6246b6d7-1104-473e-8828-d91f221926d8	simple@gmail.com	$2b$10$rqLzeA6va9G1G7wh5sPSUOjhDLHgkCwHg7nhIxTT80a5UCG9uqp/q	simple	\N	2025-10-19 08:11:16.080377	2025-10-19 08:33:43.373892	user	t	\N	\N	\N	\N	\N	\N	\N	SAR	simple	simple	active	t	PK	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
8ebca16e-1803-40d9-93c6-144a020b9834	ali.khan@example.com	$2a$10$dummypasswordhash	Ali Khan	\N	2025-10-14 05:41:23.03082	2025-10-14 05:41:23.03082	user	t	\N	\N	\N	\N	\N	\N	\N	USD	ali.khan	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
529b6962-8cd9-4202-bc16-0dc52b11c3a5	hassan.ali@example.com	$2a$10$dummypasswordhash	Hassan Ali	\N	2025-10-14 05:42:00.456224	2025-10-14 05:42:00.456224	user	t	\N	\N	\N	\N	\N	\N	\N	USD	hassan.ali	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
4e37f88f-fedd-4808-9c6a-8fe4203499f2	sara.ahmed@example.com	$2b$10$UpFUaojXIKqCvpWZq5xfnuP7GcFyPGFB5/Gcr7iB06BPsIqLr5as.	Sara Ahmed	\N	2025-10-14 05:41:59.482736	2025-10-14 19:55:02.071767	student	t							\N	PKR	sara.ahmed	student	active	t	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
cd19b09a-75cc-4ad4-aeab-f6274dbcadda	admin@example.com	$2b$10$YNXhmfs.cSA/PPcWR.EaX.Z/T8C2v0cHwFIH7NcbDPb0Fyo2tKAdS	Admin User	\N	2025-10-04 12:26:22.597771	2025-10-04 18:09:20.755357	admin	t							\N	PKR	\N	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
00e08db3-2fed-4677-b1e9-337a18be925d	asadabbas@gmail.com	$2b$10$APpJlxeMn9T1llqntX5E5ejrvgmBBhiQv682aSoP4EiUAA5.0cKRK	Asad Abbas	\N	2025-10-05 08:39:36.541062	2025-10-05 08:39:36.541062	user	t	\N	\N	\N	\N	\N	\N	\N	PKR	asadabbas	instructor	pending	f	PK	BS English	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
87234936-29c5-436f-a132-487741949f07	anas@gmail.com	$2b$10$xS2Kua.aUb3WSTT4qOPDN.i4wv/q0WtABI.Fo.QBOIbkEpUn13OxC	anas	\N	2025-10-05 08:51:10.391712	2025-10-05 08:51:10.391712	instructor	f	\N	\N	\N	\N	\N	\N	\N	USD	anas123	instructor	pending	f	PK	wwr err	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
e71d1946-5fac-4ed6-a13d-d0a5164e8cb8	mateenali@gmail.com	$2b$10$QapukZoQa7/TSW1W5CsdrOugFbsxrnREWhwrpA1z4yAwb18DXXO2u	mateen ali	\N	2025-10-05 10:53:25.358846	2025-10-05 10:53:25.358846	instructor	f	\N	\N	\N	\N	\N	\N	\N	PKR	mateenali	instructor	pending	f	PK	Bs Computer Science	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
6c393ae7-16c7-4a98-9235-bb150739d15e	wahajali@gmail.com	$2b$10$67DZQ9teNWwDOKo2CWSXYeDIl67x0pkXJZlQGvDyGH4zA100gan1O	wahaj	\N	2025-10-05 11:04:06.783636	2025-10-05 11:04:06.783636	instructor	f	\N	\N	\N	\N	\N	\N	\N	PKR	wahaj	instructor	pending	f	PK	BS English	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
fd8bba00-f76d-4358-b2d1-99409cebddb1	student@gamil.com	$2b$10$C3Dgh9O.XdSzLGf3x8jffu2jGhQz3ebfEmTO2pXy3B5L0qgRtzTYS	student	\N	2025-10-10 20:40:18.890561	2025-10-10 20:40:18.890561	student	t	\N	\N	\N	\N	\N	\N	\N	PKR	student	student	active	t	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
1890e5ef-986b-435d-97bd-e306477d8246	waqas@gmail.com	$2b$10$juEOWVASKL1CVJH3g5sLtu92Gb8B9TGFfS6br6V477ctDL78ey54C	waqas	\N	2025-10-05 11:13:43.368663	2025-10-05 14:07:28.111771	instructor	t							\N	PKR	waqas	instructor	active	t	PK	BS CS	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
c19ae49d-5368-440f-abb4-37dbb85e9ef1	ammad@gmail.com	$2b$10$WZGeQ469V.lJhlBbRstggugt1gTE7tQctfMxRZXXHLkeILzEZwFR6	Ammad	\N	2025-10-05 14:41:20.752532	2025-10-05 14:41:20.752532	student	t	\N	\N	\N	\N	\N	\N	\N	PKR	ammad	student	active	t	PK	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
fa37d618-7212-43cc-a2b7-dd16904681a0	hadi@gmail.com	$2b$10$8QIqmicPYMmJp2chfFssPe5tYCugH5A2pGkkPNuJR8j9vxuzk2mMO	Hadi	\N	2025-10-06 13:56:11.48321	2025-10-06 13:57:52.435179	instructor	t	\N	\N	\N	\N	\N	\N	\N	PKR	hadiali	instructor	active	t	PK	BS ENglish	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
instructor-sample-1	teacher@example.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	John Smith	\N	2025-10-10 20:34:15.631655	2025-10-10 20:34:15.631655	user	t	\N	\N	\N	\N	\N	\N	\N	USD	\N	instructor	active	t	\N	Master's in Computer Science	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
student-sample-1	student@example.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Alice Johnson	\N	2025-10-10 20:34:15.937816	2025-10-10 20:34:15.937816	user	t	\N	\N	\N	\N	\N	\N	\N	USD	\N	student	active	f	United States	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
b8faa774-726d-48ff-a1bb-02d9bfe4ff33	teacher@gmail.com	$2b$10$mTjohrOeaDw7.88DRmZNsuurW6AMsz/z0.4QZG.ic666NPEGXKafi	teacher	\N	2025-10-10 20:45:19.276269	2025-10-19 07:36:00.739536	instructor	t	\N	\N	\N	\N	\N	\N	\N	PKR	teacher	instructor	active	t	PK	BS Computer Science	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
031e0e1d-37c1-4788-a034-113899ae2322	student@gmail.com	$2b$10$qUy5ZiAvp5HhbIiz2XwlgOmj.Xhpga7Sjs2NLbqUIP9BHoonYLzQi	student2	\N	2025-10-15 04:37:18.486463	2025-10-15 04:37:18.486463	student	t	\N	\N	\N	\N	\N	\N	\N	SAR	student2	student	active	t	SA	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
e8db3f8e-9afc-4b8a-bdac-bba45007b568	student2@gmail.com	$2b$10$AR7Sp1NoN9Hu/btOwQ6vPeABmPFAPbw5hoO92pHoXv8hSmDpQpL7S	Student Two	\N	2025-10-15 19:32:31.899096	2025-10-15 19:32:31.899096	user	t	\N	\N	\N	\N	\N	\N	\N	USD	\N	student	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
98a92c53-6d0b-43b0-845f-373e8a5e18fc	student1@gmail.com	$2b$10$a4xYQlnWLXDUedHB0cxxrOvIH6mH5gdvE7mQcbVJ6LxiZUZdY0q62	student1	\N	2025-10-15 04:22:25.081248	2025-10-19 07:16:09.656732	student	t	\N	\N	\N	\N	\N	\N	\N	PKR	student1	student	active	t	PK	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
644a7d67-7b83-43df-a3be-9b11c406824c	admin1@gmail.com	$2b$10$tPYY7kBMVg5HexwJdVuqpuvCckSsluGK.X94OpVkxYgkf7J7BX5qm	admin1	\N	2025-10-19 12:45:45.323989	2025-10-19 12:45:45.323989	admin	t	\N	\N	\N	\N	\N	\N	\N	USD	admin1	simple	active	t	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
2e8433d7-2ce4-40b7-9e75-9bd242887b13	wajidworkstation@gmail.com	$2b$10$9WOxOC8LGvqwuiaKu.CbKe4A9LIHWZhr7RN5qVUaIdAjzrtWIbc.m	Admin User	\N	2025-10-14 03:21:29.559505	2025-10-19 12:46:23.644624	admin	t	\N	\N	\N	\N	\N	\N	\N	USD	\N	simple	active	f	\N	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
a9dd796c-b2e8-49c5-9948-90642cb7239e	abubakr.ab69@gmail.com	$2b$10$8it8WoXXdTD/ks6eQosuQOiO2gqR2rtP3IsggkkrPrhyzHDVndMpa	Muhammad Abu Bakr	\N	2025-10-20 05:25:50.016948	2025-10-20 05:25:50.016948	student	t	\N	\N	\N	\N	\N	\N	\N	PKR	abubakrnangiana	student	active	t	PK	\N	common	{"meeting_reminders": true, "sms_notifications": false, "push_notifications": true, "email_notifications": true, "message_notifications": true}	\N
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, true);


--
-- Name: playing_with_neon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.playing_with_neon_id_seq', 10, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: bank_details bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bank_details
    ADD CONSTRAINT bank_details_pkey PRIMARY KEY (id);


--
-- Name: class_meetings class_meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_meetings
    ADD CONSTRAINT class_meetings_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: course_bank_details course_bank_details_course_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_bank_details
    ADD CONSTRAINT course_bank_details_course_id_key UNIQUE (course_id);


--
-- Name: course_bank_details course_bank_details_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_bank_details
    ADD CONSTRAINT course_bank_details_pkey PRIMARY KEY (id);


--
-- Name: course_bookings course_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_bookings
    ADD CONSTRAINT course_bookings_pkey PRIMARY KEY (id);


--
-- Name: course_installments course_installments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_installments
    ADD CONSTRAINT course_installments_pkey PRIMARY KEY (id);


--
-- Name: course_installments course_installments_user_course_id_installment_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_installments
    ADD CONSTRAINT course_installments_user_course_id_installment_number_key UNIQUE (user_course_id, installment_number);


--
-- Name: course_instructors course_instructors_course_id_instructor_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT course_instructors_course_id_instructor_id_key UNIQUE (course_id, instructor_id);


--
-- Name: course_instructors course_instructors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT course_instructors_pkey PRIMARY KEY (id);


--
-- Name: course_messages course_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_messages
    ADD CONSTRAINT course_messages_pkey PRIMARY KEY (id);


--
-- Name: course_notifications course_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_notifications
    ADD CONSTRAINT course_notifications_pkey PRIMARY KEY (id);


--
-- Name: course_payments course_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_payments
    ADD CONSTRAINT course_payments_pkey PRIMARY KEY (id);


--
-- Name: course_requests course_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: fee_plan_history fee_plan_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plan_history
    ADD CONSTRAINT fee_plan_history_pkey PRIMARY KEY (id);


--
-- Name: fee_plans fee_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_pkey PRIMARY KEY (id);


--
-- Name: fee_plans fee_plans_student_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_student_id_course_id_key UNIQUE (student_id, course_id);


--
-- Name: installment_schedule installment_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.installment_schedule
    ADD CONSTRAINT installment_schedule_pkey PRIMARY KEY (id);


--
-- Name: instructor_messages instructor_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_messages
    ADD CONSTRAINT instructor_messages_pkey PRIMARY KEY (id);


--
-- Name: instructor_notifications instructor_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_notifications
    ADD CONSTRAINT instructor_notifications_pkey PRIMARY KEY (id);


--
-- Name: instructor_payments instructor_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_payments
    ADD CONSTRAINT instructor_payments_pkey PRIMARY KEY (id);


--
-- Name: instructor_salary instructor_salary_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_salary
    ADD CONSTRAINT instructor_salary_pkey PRIMARY KEY (id);


--
-- Name: meeting_bookings meeting_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.meeting_bookings
    ADD CONSTRAINT meeting_bookings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: monthly_fees monthly_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.monthly_fees
    ADD CONSTRAINT monthly_fees_pkey PRIMARY KEY (id);


--
-- Name: monthly_fees monthly_fees_user_course_id_month_year_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.monthly_fees
    ADD CONSTRAINT monthly_fees_user_course_id_month_year_key UNIQUE (user_course_id, month, year);


--
-- Name: notification_reads notification_reads_notification_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_reads
    ADD CONSTRAINT notification_reads_notification_id_student_id_key UNIQUE (notification_id, student_id);


--
-- Name: notification_reads notification_reads_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_reads
    ADD CONSTRAINT notification_reads_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: payment_records payment_records_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_pkey PRIMARY KEY (id);


--
-- Name: playing_with_neon playing_with_neon_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.playing_with_neon
    ADD CONSTRAINT playing_with_neon_pkey PRIMARY KEY (id);


--
-- Name: service_bookings service_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_pkey PRIMARY KEY (id);


--
-- Name: service_payments service_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_payments
    ADD CONSTRAINT service_payments_pkey PRIMARY KEY (id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: student_classes student_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_pkey PRIMARY KEY (id);


--
-- Name: student_classes student_classes_student_id_class_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_student_id_class_id_key UNIQUE (student_id, class_id);


--
-- Name: student_courses student_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_courses
    ADD CONSTRAINT student_courses_pkey PRIMARY KEY (id);


--
-- Name: student_enrollments student_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT student_enrollments_pkey PRIMARY KEY (id);


--
-- Name: student_enrollments student_enrollments_student_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT student_enrollments_student_id_course_id_key UNIQUE (student_id, course_id);


--
-- Name: student_fees student_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_pkey PRIMARY KEY (id);


--
-- Name: student_payments student_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_payments
    ADD CONSTRAINT student_payments_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_value_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_value_key UNIQUE (value);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: user_services user_services_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT user_services_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: idx_bank_details_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_bank_details_active ON public.bank_details USING btree (is_active);


--
-- Name: idx_bank_details_currency; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_bank_details_currency ON public.bank_details USING btree (currency);


--
-- Name: idx_course_bank_details_course_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_bank_details_course_id ON public.course_bank_details USING btree (course_id);


--
-- Name: idx_course_installments_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_installments_status ON public.course_installments USING btree (status);


--
-- Name: idx_course_installments_user_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_installments_user_course ON public.course_installments USING btree (user_course_id);


--
-- Name: idx_course_instructors_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_instructors_course ON public.course_instructors USING btree (course_id);


--
-- Name: idx_course_instructors_instructor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_instructors_instructor ON public.course_instructors USING btree (instructor_id);


--
-- Name: idx_course_instructors_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_instructors_role ON public.course_instructors USING btree (role);


--
-- Name: idx_course_notifications_course_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_notifications_course_id ON public.course_notifications USING btree (course_id);


--
-- Name: idx_course_notifications_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_course_notifications_created_at ON public.course_notifications USING btree (created_at DESC);


--
-- Name: idx_fee_history_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_fee_history_student ON public.fee_plan_history USING btree (student_id);


--
-- Name: idx_fee_history_student_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_fee_history_student_course ON public.fee_plan_history USING btree (student_course_id);


--
-- Name: idx_fee_plans_bank_details; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_fee_plans_bank_details ON public.fee_plans USING btree (bank_details_id);


--
-- Name: idx_fee_plans_instructor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_fee_plans_instructor ON public.fee_plans USING btree (instructor_id);


--
-- Name: idx_fee_plans_student_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_fee_plans_student_course ON public.fee_plans USING btree (student_id, course_id);


--
-- Name: idx_installment_schedule_due_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_installment_schedule_due_date ON public.installment_schedule USING btree (due_date);


--
-- Name: idx_installment_schedule_fee_plan; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_installment_schedule_fee_plan ON public.installment_schedule USING btree (fee_plan_id);


--
-- Name: idx_instructor_messages_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_instructor_messages_course ON public.instructor_messages USING btree (course_id);


--
-- Name: idx_instructor_messages_instructor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_instructor_messages_instructor ON public.instructor_messages USING btree (instructor_id);


--
-- Name: idx_instructor_messages_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_instructor_messages_student ON public.instructor_messages USING btree (student_id);


--
-- Name: idx_messages_from_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_messages_from_user ON public.messages USING btree (from_user_id);


--
-- Name: idx_messages_to_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_messages_to_user ON public.messages USING btree (to_user_id);


--
-- Name: idx_monthly_fees_due_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_monthly_fees_due_date ON public.monthly_fees USING btree (due_date);


--
-- Name: idx_monthly_fees_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_monthly_fees_status ON public.monthly_fees USING btree (status);


--
-- Name: idx_monthly_fees_user_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_monthly_fees_user_course ON public.monthly_fees USING btree (user_course_id);


--
-- Name: idx_notification_reads_notification; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notification_reads_notification ON public.notification_reads USING btree (notification_id);


--
-- Name: idx_notification_reads_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notification_reads_student ON public.notification_reads USING btree (student_id);


--
-- Name: idx_payment_history_fee_plan; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payment_history_fee_plan ON public.payment_history USING btree (fee_plan_id);


--
-- Name: idx_payment_records_fee_plan; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payment_records_fee_plan ON public.payment_records USING btree (fee_plan_id);


--
-- Name: idx_payment_records_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payment_records_status ON public.payment_records USING btree (status);


--
-- Name: idx_payment_records_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payment_records_student ON public.payment_records USING btree (student_id);


--
-- Name: idx_student_courses_student_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_student_courses_student_status ON public.student_courses USING btree (student_id, status);


--
-- Name: idx_student_enrollments_course; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_student_enrollments_course ON public.student_enrollments USING btree (course_id);


--
-- Name: idx_student_enrollments_instructor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_student_enrollments_instructor ON public.student_enrollments USING btree (instructor_id);


--
-- Name: idx_student_enrollments_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_student_enrollments_student ON public.student_enrollments USING btree (student_id);


--
-- Name: user_services_user_id_service_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX user_services_user_id_service_id_key ON public.user_services USING btree (user_id, service_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: class_meetings class_meetings_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class_meetings
    ADD CONSTRAINT class_meetings_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: classes classes_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_bank_details course_bank_details_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_bank_details
    ADD CONSTRAINT course_bank_details_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_bookings course_bookings_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_bookings
    ADD CONSTRAINT course_bookings_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: course_notifications course_notifications_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_notifications
    ADD CONSTRAINT course_notifications_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_notifications course_notifications_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_notifications
    ADD CONSTRAINT course_notifications_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_requests course_requests_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_requests
    ADD CONSTRAINT course_requests_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fee_plan_history fee_plan_history_student_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plan_history
    ADD CONSTRAINT fee_plan_history_student_course_id_fkey FOREIGN KEY (student_course_id) REFERENCES public.student_courses(id) ON DELETE CASCADE;


--
-- Name: fee_plans fee_plans_bank_details_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_bank_details_id_fkey FOREIGN KEY (bank_details_id) REFERENCES public.bank_details(id);


--
-- Name: fee_plans fee_plans_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: fee_plans fee_plans_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: fee_plans fee_plans_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.fee_plans
    ADD CONSTRAINT fee_plans_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_instructors fk_course_instructors_course; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT fk_course_instructors_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: course_instructors fk_course_instructors_instructor; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.course_instructors
    ADD CONSTRAINT fk_course_instructors_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: courses fk_courses_instructor; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: instructor_messages fk_instructor_messages_course; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_messages
    ADD CONSTRAINT fk_instructor_messages_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: instructor_messages fk_instructor_messages_instructor; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_messages
    ADD CONSTRAINT fk_instructor_messages_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: instructor_messages fk_instructor_messages_student; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_messages
    ADD CONSTRAINT fk_instructor_messages_student FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications fk_notifications_sender; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notifications_sender FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: student_enrollments fk_student_enrollments_course; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT fk_student_enrollments_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: student_enrollments fk_student_enrollments_instructor; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT fk_student_enrollments_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: student_enrollments fk_student_enrollments_student; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollments
    ADD CONSTRAINT fk_student_enrollments_student FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: installment_schedule installment_schedule_fee_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.installment_schedule
    ADD CONSTRAINT installment_schedule_fee_plan_id_fkey FOREIGN KEY (fee_plan_id) REFERENCES public.fee_plans(id) ON DELETE CASCADE;


--
-- Name: installment_schedule installment_schedule_payment_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.installment_schedule
    ADD CONSTRAINT installment_schedule_payment_record_id_fkey FOREIGN KEY (payment_record_id) REFERENCES public.payment_records(id);


--
-- Name: instructor_notifications instructor_notifications_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_notifications
    ADD CONSTRAINT instructor_notifications_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: instructor_payments instructor_payments_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_payments
    ADD CONSTRAINT instructor_payments_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: instructor_salary instructor_salary_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.instructor_salary
    ADD CONSTRAINT instructor_salary_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notification_reads notification_reads_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_reads
    ADD CONSTRAINT notification_reads_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.course_notifications(id) ON DELETE CASCADE;


--
-- Name: notification_reads notification_reads_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification_reads
    ADD CONSTRAINT notification_reads_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_history payment_history_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_fee_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_fee_plan_id_fkey FOREIGN KEY (fee_plan_id) REFERENCES public.fee_plans(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_history payment_history_payment_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_payment_record_id_fkey FOREIGN KEY (payment_record_id) REFERENCES public.payment_records(id);


--
-- Name: payment_history payment_history_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_records payment_records_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: payment_records payment_records_fee_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_fee_plan_id_fkey FOREIGN KEY (fee_plan_id) REFERENCES public.fee_plans(id) ON DELETE CASCADE;


--
-- Name: payment_records payment_records_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payment_records payment_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_records
    ADD CONSTRAINT payment_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: service_payments service_payments_user_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.service_payments
    ADD CONSTRAINT service_payments_user_service_id_fkey FOREIGN KEY (user_service_id) REFERENCES public.user_services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_classes student_classes_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- Name: student_classes student_classes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_classes
    ADD CONSTRAINT student_classes_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: student_courses student_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_courses
    ADD CONSTRAINT student_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: student_courses student_courses_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_courses
    ADD CONSTRAINT student_courses_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: student_fees student_fees_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: student_fees student_fees_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: student_payments student_payments_fee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_payments
    ADD CONSTRAINT student_payments_fee_id_fkey FOREIGN KEY (fee_id) REFERENCES public.student_fees(id);


--
-- Name: student_payments student_payments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_payments
    ADD CONSTRAINT student_payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: user_services user_services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT user_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_services user_services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT user_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict 5cSf53szIY0avg0KUZsdmWS53dt10fqRA1SYeWs18KX6zD1r6Y9LqdEWXetKSZc

