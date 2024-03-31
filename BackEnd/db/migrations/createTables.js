export const createApprovalTable = `
CREATE TABLE IF NOT EXISTS public.approvals (
    approval_id integer NOT NULL,
    user_id integer,
    admin_user_id integer,
    approval_status character varying(20),
    approval_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
`
export const createDC02Table = `
CREATE TABLE IF NOT EXISTS public.dc02_hardware (
    machine_id character varying(20) NOT NULL,
    status jsonb
);
`
export const createMachineStatusTable = `
CREATE TABLE IF NOT EXISTS public.machine_status (
    machine_id character varying(20) NOT NULL,
    status jsonb
);
`
export const createLoginMethodTable = `
CREATE TABLE IF NOT EXISTS public.login_methods (
    login_id integer NOT NULL,
    user_id integer,
    login_method character varying(20),
    login_identifier character varying(255)
);
`
export const createUsersTable = `
CREATE TABLE IF NOT EXISTS public.users (
    user_id integer NOT NULL,
    username character varying(255),
    email character varying(255),
    phone_number character varying(20),
    password_hash character varying(255),
    status character varying(20) DEFAULT 'pending'::character varying,
    role character varying(20) DEFAULT 'user'::character varying
);
`

export default [createApprovalTable, createDC02Table, createMachineStatusTable, createLoginMethodTable, createUsersTable]