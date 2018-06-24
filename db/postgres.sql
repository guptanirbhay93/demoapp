CREATE TABLE public.person (
  id          bigserial primary key,
  "firstName" varchar(80), 
  "lastName"  varchar(80), 
  email       varchar(80), 
  age         integer,
  gender      varchar(80),
  country     text
);
ALTER TABLE public.person OWNER TO demopostgres;

CREATE TABLE public.android_app (
  id          bigserial primary key,
  name        text,
  "iconUrl"   text
);

ALTER TABLE public.android_app OWNER TO demopostgres;

CREATE TABLE public.app_user (
  id          bigserial,
  "userId"    integer references public.person(id),
  "appId"     integer references public.android_app(id),
  installed   boolean
);

ALTER TABLE public.app_user OWNER TO demopostgres;