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