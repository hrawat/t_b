create table User (
    id                        varchar(23) primary key,
    creationDate              datetime,
    lastModificationDate      datetime,
    deleted                   tinyint(1) default 0,
    type                      tinyint(1),
    status                    tinyint(1),
    fbUid                     varchar(64),
    firstName                 varchar(64),
    lastName                  varchar(64),
    gender                    char(1),
    emailAddress              varchar(128),
    dateOfBirth               date,
    invitedBy                 varchar(23)
);

create table Category (
    id                        varchar(23) primary key,
    creationDate              datetime,
    lastModificationDate      datetime,
    deleted                   tinyint(1)  default 0,
    name                      varchar(64),
    colorCode                 varchar(16),
    createdBy                 varchar(23)
);

create table CategoryUser (
    categoryId                varchar(23),
    userId                    varchar(23),
    type                      tinyint(1),
    creationDate              datetime,
    primary key(userId, categoryId),
    foreign key (categoryId) references Category(id) on delete cascade
);

create unique index CategoryUser_userId_categoryId on CategoryUser(userId, categoryId);

create table Task (
    id                        varchar(23),
    creationDate              datetime,
    lastModificationDate      datetime,
    deleted                   tinyint(1) default 0,
    categoryId                varchar(23),
    title                     varchar(512),
    description               varchar(1024),
    dueDate                   datetime,
    status                    tinyint(1),
    completionDate            datetime,
    createdBy                 varchar(23),
    completedBy               varchar(23),
    priority                  tinyint(1)
);