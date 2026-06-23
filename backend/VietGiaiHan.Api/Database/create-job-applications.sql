CREATE TABLE JobApplications (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    FullName      NVARCHAR(100)  NOT NULL,
    Phone         NVARCHAR(20)   NOT NULL,
    Email         NVARCHAR(200)  NOT NULL,
    Position      NVARCHAR(200)  NOT NULL,
    CvUrl         NVARCHAR(500)  NULL,
    CvFileName    NVARCHAR(200)  NULL,
    Message       NVARCHAR(1000) NULL,
    Status        NVARCHAR(50)   DEFAULT 'new',
    IsViewed      BIT            DEFAULT 0,
    ViewedAt      DATETIME       NULL,
    CreatedAt     DATETIME       DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME       NULL
);
