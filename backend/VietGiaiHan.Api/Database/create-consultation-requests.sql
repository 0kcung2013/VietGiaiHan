IF DB_ID(N'VietGiaiHanDb') IS NULL
BEGIN
    RAISERROR(N'Database VietGiaiHanDb does not exist.', 16, 1);
    RETURN;
END
GO

USE VietGiaiHanDb;
GO

IF OBJECT_ID(N'dbo.ConsultationRequests', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ConsultationRequests
    (
        Id              INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ConsultationRequests PRIMARY KEY,
        FullName        NVARCHAR(100)  NOT NULL,
        Phone           NVARCHAR(20)   NOT NULL,
        Message         NVARCHAR(1000) NULL,
        ProductId       INT            NULL,
        ProductName     NVARCHAR(255)  NOT NULL,
        ProductSlug     NVARCHAR(255)  NOT NULL,
        Status          NVARCHAR(50)   NOT NULL CONSTRAINT DF_ConsultationRequests_Status DEFAULT N'new',
        AdminNote       NVARCHAR(1000) NULL,
        CreatedAt       DATETIME2      NOT NULL CONSTRAINT DF_ConsultationRequests_CreatedAt DEFAULT SYSUTCDATETIME(),
        UpdatedAt       DATETIME2      NULL
    );
END
GO

-- Index for admin queries by status
IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_ConsultationRequests_Status'
      AND object_id = OBJECT_ID(N'dbo.ConsultationRequests')
)
BEGIN
    CREATE INDEX IX_ConsultationRequests_Status ON dbo.ConsultationRequests(Status);
END
GO

-- Index for lookup by product
IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_ConsultationRequests_ProductSlug'
      AND object_id = OBJECT_ID(N'dbo.ConsultationRequests')
)
BEGIN
    CREATE INDEX IX_ConsultationRequests_ProductSlug ON dbo.ConsultationRequests(ProductSlug);
END
GO

PRINT N'ConsultationRequests table created successfully.';
GO
