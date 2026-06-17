IF DB_ID(N'VietGiaiHanDb') IS NULL
BEGIN
    RAISERROR(N'Database VietGiaiHanDb does not exist.', 16, 1);
    RETURN;
END
GO

USE VietGiaiHanDb;
GO

IF COL_LENGTH(N'dbo.ConsultationRequests', N'IsViewed') IS NULL
BEGIN
    ALTER TABLE dbo.ConsultationRequests
    ADD IsViewed BIT NOT NULL
        CONSTRAINT DF_ConsultationRequests_IsViewed DEFAULT 0;
END
GO

IF COL_LENGTH(N'dbo.ConsultationRequests', N'ViewedAt') IS NULL
BEGIN
    ALTER TABLE dbo.ConsultationRequests
    ADD ViewedAt DATETIME2 NULL;
END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_ConsultationRequests_IsViewed'
      AND object_id = OBJECT_ID(N'dbo.ConsultationRequests')
)
BEGIN
    CREATE INDEX IX_ConsultationRequests_IsViewed ON dbo.ConsultationRequests(IsViewed);
END
GO

PRINT N'ConsultationRequests viewed fields added successfully.';
GO
