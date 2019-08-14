ALTER TABLE IF EXISTS boards drop constraint  boards_pk cascade ;
alter table if exists statuses drop constraint statuses_pk cascade ;
alter table if exists cards drop constraint cards_pk cascade ;
drop sequence if exists boards_id_seq cascade ;
drop sequence if exists cards_id_seq cascade ;
drop sequence if exists statuses_id_seq cascade ;
drop table if exists boards;
drop table if exists cards;
drop table if exists statuses;


create table boards
(
	id serial,
	title varchar
);

create unique index boards_id_uindex
	on boards (id);

alter table boards
	add constraint boards_pk
		primary key (id);

create table statuses
(
	id serial,
	title varchar
);

create unique index statuses_id_uindex
	on statuses (id);

alter table statuses
	add constraint statuses_pk
		primary key (id);


create table cards
(
	id serial,
	board_id int
		constraint cards_boards_id_fk
			references boards
				on delete cascade,
	title varchar,
	status_id int
		constraint cards_statuses_id_fk
			references statuses
				on delete cascade,
	"order" int
);

create unique index cards_id_uindex
	on cards (id);

alter table cards
	add constraint cards_pk
		primary key (id);