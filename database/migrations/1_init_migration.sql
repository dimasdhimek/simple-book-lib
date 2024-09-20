CREATE EXTENSION "uuid-ossp";


CREATE TABLE books (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code varchar NOT NULL,
	title varchar NOT NULL,
	author varchar NULL,
	stock int4 DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	stock_available int4 DEFAULT 0 NOT NULL,
	CONSTRAINT books_pk PRIMARY KEY (id),
	CONSTRAINT books_stock_available_check CHECK (((stock_available >= 0) AND (stock_available <= stock))),
	CONSTRAINT books_unique UNIQUE (code)
);


CREATE TABLE members (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code varchar NOT NULL,
	name varchar NOT NULL,
	active_borrowed_count int4 DEFAULT 0 NOT NULL,
	penalized_end_date timestamptz NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT members_pk PRIMARY KEY (id),
	CONSTRAINT members_unique UNIQUE (code)
);


CREATE TYPE borrow_transaction_status AS ENUM ('active', 'finished');

CREATE TABLE borrow_transactions (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	code varchar NOT NULL,
	return_date timestamptz NULL,
	member_id uuid NOT NULL,
	book_id uuid NOT NULL,
	status borrow_transaction_status DEFAULT 'active'::borrow_transaction_status NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT borrow_transactions_pk PRIMARY KEY (id),
	CONSTRAINT borrow_transactions_unique UNIQUE (code),
	CONSTRAINT borrow_transactions_books_fk FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT borrow_transactions_members_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE INDEX borrow_transactions_status_idx ON borrow_transactions USING btree (status);