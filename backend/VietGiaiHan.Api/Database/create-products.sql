IF DB_ID(N'VietGiaiHanDb') IS NULL
BEGIN
    CREATE DATABASE VietGiaiHanDb;
END
GO

USE VietGiaiHanDb;
GO

IF OBJECT_ID(N'dbo.ProductCategories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProductCategories
    (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ProductCategories PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(100) NOT NULL,
        Description NVARCHAR(500) NOT NULL,
        SortOrder INT NOT NULL CONSTRAINT DF_ProductCategories_SortOrder DEFAULT 0,
        Status NVARCHAR(50) NOT NULL CONSTRAINT DF_ProductCategories_Status DEFAULT N'Active',
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ProductCategories_CreatedAt DEFAULT SYSUTCDATETIME()
    );

END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'UX_ProductCategories_Slug'
      AND object_id = OBJECT_ID(N'dbo.ProductCategories')
)
BEGIN
    CREATE UNIQUE INDEX UX_ProductCategories_Slug ON dbo.ProductCategories(Slug);
END
GO

MERGE dbo.ProductCategories AS target
USING
(
    VALUES
        (N'Nội thất gỗ', N'noi-that-go', N'Tủ, kệ và vật dụng nội thất làm từ gỗ tự nhiên cho không gian sống ấm áp.', 1, N'Active'),
        (N'Đồ trang trí gỗ', N'do-trang-tri-go', N'Sản phẩm mỹ nghệ gỗ dùng làm điểm nhấn cho phòng khách, phòng ngủ và sảnh đón.', 2, N'Active'),
        (N'Đồ gia dụng gỗ', N'do-gia-dung-go', N'Các vật dụng gỗ thủ công phục vụ sinh hoạt hằng ngày, bền đẹp và dễ sử dụng.', 3, N'Active'),
        (N'Quà tặng mỹ nghệ', N'qua-tang-my-nghe', N'Sản phẩm gỗ tinh xảo phù hợp làm quà biếu, quà tặng doanh nghiệp và dịp lễ.', 4, N'Active'),
        (N'Đèn gỗ thủ công', N'den-go-thu-cong', N'Đèn trang trí làm từ gỗ với ánh sáng dịu, tạo cảm giác thư giãn cho không gian.', 5, N'Active'),
        (N'Phụ kiện bàn trà', N'phu-kien-ban-tra', N'Khay, hộp và phụ kiện gỗ dành cho bàn trà, góc tiếp khách và không gian thưởng trà.', 6, N'Active')
) AS source (Name, Slug, Description, SortOrder, Status)
ON target.Slug = source.Slug
WHEN MATCHED THEN
    UPDATE SET
        Name = source.Name,
        Description = source.Description,
        SortOrder = source.SortOrder,
        Status = source.Status
WHEN NOT MATCHED THEN
    INSERT (Name, Slug, Description, SortOrder, Status)
    VALUES (source.Name, source.Slug, source.Description, source.SortOrder, source.Status);
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Products
    (
        Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Products PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Slug NVARCHAR(200) NOT NULL,
        Description NVARCHAR(1000) NOT NULL,
        CategoryId INT NULL,
        Category NVARCHAR(100) NOT NULL,
        ImageUrl NVARCHAR(500) NOT NULL,
        IsFeatured BIT NOT NULL CONSTRAINT DF_Products_IsFeatured DEFAULT 0,
        SortOrder INT NOT NULL CONSTRAINT DF_Products_SortOrder DEFAULT 0,
        Status NVARCHAR(50) NOT NULL CONSTRAINT DF_Products_Status DEFAULT N'Active',
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME()
    );

END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'UX_Products_Slug'
      AND object_id = OBJECT_ID(N'dbo.Products')
)
BEGIN
    CREATE UNIQUE INDEX UX_Products_Slug ON dbo.Products(Slug);
END
GO

IF COL_LENGTH(N'dbo.Products', N'CategoryId') IS NULL
BEGIN
    ALTER TABLE dbo.Products ADD CategoryId INT NULL;
END
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Products_ProductCategories_CategoryId'
)
BEGIN
    ALTER TABLE dbo.Products
    ADD CONSTRAINT FK_Products_ProductCategories_CategoryId
        FOREIGN KEY (CategoryId) REFERENCES dbo.ProductCategories(Id);
END
GO

MERGE dbo.Products AS target
USING
(
    -- Một số sản phẩm đang dùng lại ảnh hiện có. Cần bổ sung thêm ảnh thật khi mở rộng catalog.
    VALUES
        (N'Tủ gỗ mây tre truyền thống', N'tu-go-may-tre-truyen-thong', N'Tủ lưu trữ nhỏ gọn kết hợp chất liệu gỗ và mây tre, phù hợp phòng khách hoặc phòng ngủ.', N'noi-that-go', N'Nội thất gỗ', N'/images/product/tu-go-tre.jpg', 1, 1, N'Active'),
        (N'Kệ trang trí gỗ tự nhiên', N'ke-trang-tri-go-tu-nhien', N'Kệ gỗ dáng thanh lịch dùng trưng bày sách, bình hoa và vật phẩm mỹ nghệ trong nhà.', N'noi-that-go', N'Nội thất gỗ', N'/images/product/tu-go-tre.jpg', 0, 2, N'Active'),
        (N'Tủ trà gỗ hương mini', N'tu-tra-go-huong-mini', N'Tủ gỗ nhỏ dành cho góc thưởng trà, bề mặt hoàn thiện mịn và vân gỗ ấm.', N'noi-that-go', N'Nội thất gỗ', N'/images/product/hop-tra-go.jpg', 0, 3, N'Active'),
        (N'Bình hoa gỗ mỹ nghệ', N'binh-hoa-go-my-nghe', N'Bình hoa gỗ tạo hình mềm mại, phù hợp làm điểm nhấn trên bàn console hoặc kệ trang trí.', N'do-trang-tri-go', N'Đồ trang trí gỗ', N'/images/product/binh-hoa.jpg', 1, 4, N'Active'),
        (N'Tượng trang trí gỗ tối giản', N'tuong-trang-tri-go-toi-gian', N'Vật phẩm gỗ dáng tối giản, dễ phối với không gian hiện đại và phong cách Á Đông.', N'do-trang-tri-go', N'Đồ trang trí gỗ', N'/images/product/binh-hoa.jpg', 0, 5, N'Active'),
        (N'Giỏ tre đan tay Việt', N'gio-tre-dan-tay-viet', N'Giỏ tre đan thủ công, nhẹ, bền và tiện dụng cho lưu trữ đồ dùng hằng ngày.', N'do-gia-dung-go', N'Đồ gia dụng gỗ', N'/images/product/gio-tre.jpg', 1, 6, N'Active'),
        (N'Khay gỗ phục vụ đa năng', N'khay-go-phuc-vu-da-nang', N'Khay gỗ bề mặt rộng, dùng phục vụ trà, đồ ăn nhẹ hoặc trưng bày sản phẩm thủ công.', N'do-gia-dung-go', N'Đồ gia dụng gỗ', N'/images/product/khay-go.jpg', 1, 7, N'Active'),
        (N'Hộp đựng vật dụng gỗ', N'hop-dung-vat-dung-go', N'Hộp gỗ nhỏ giúp sắp xếp phụ kiện, trang sức hoặc vật dụng cá nhân gọn gàng.', N'do-gia-dung-go', N'Đồ gia dụng gỗ', N'/images/product/hop-tra-go.jpg', 0, 8, N'Active'),
        (N'Hộp trà gỗ hương cao cấp', N'hop-tra-go-huong-cao-cap', N'Hộp trà gỗ hương có vân đẹp, giữ hương tốt và thích hợp làm quà biếu trang nhã.', N'qua-tang-my-nghe', N'Quà tặng mỹ nghệ', N'/images/product/hop-tra-go.jpg', 1, 9, N'Active'),
        (N'Bộ quà tặng khay gỗ thủ công', N'bo-qua-tang-khay-go-thu-cong', N'Bộ quà tặng gồm khay gỗ và phụ kiện trang trí, phù hợp khách hàng doanh nghiệp.', N'qua-tang-my-nghe', N'Quà tặng mỹ nghệ', N'/images/product/khay-go.jpg', 0, 10, N'Active'),
        (N'Bình hoa gỗ quà tặng', N'binh-hoa-go-qua-tang', N'Bình hoa gỗ hoàn thiện tinh tế, phù hợp tặng tân gia, khai trương hoặc tri ân đối tác.', N'qua-tang-my-nghe', N'Quà tặng mỹ nghệ', N'/images/product/binh-hoa.jpg', 0, 11, N'Active'),
        (N'Đèn ngủ gỗ điêu khắc', N'den-ngu-go-dieu-khac', N'Đèn gỗ chạm khắc thủ công, ánh sáng dịu giúp không gian nghỉ ngơi thêm ấm cúng.', N'den-go-thu-cong', N'Đèn gỗ thủ công', N'/images/product/den-ngu-go.jpg', 1, 12, N'Active'),
        (N'Đèn bàn gỗ ánh vàng', N'den-ban-go-anh-vang', N'Đèn bàn gỗ nhỏ gọn với ánh vàng nhẹ, phù hợp bàn làm việc, kệ đầu giường hoặc góc đọc sách.', N'den-go-thu-cong', N'Đèn gỗ thủ công', N'/images/product/den-ngu-go.jpg', 1, 13, N'Active'),
        (N'Đèn trang trí gỗ họa tiết', N'den-trang-tri-go-hoa-tiet', N'Đèn gỗ họa tiết thủ công tạo hiệu ứng ánh sáng mềm, dùng tốt cho không gian thư giãn.', N'den-go-thu-cong', N'Đèn gỗ thủ công', N'/images/product/den-ngu-go.jpg', 0, 14, N'Active'),
        (N'Khay trà gỗ bo cạnh', N'khay-tra-go-bo-canh', N'Khay trà gỗ bo cạnh an toàn, kích thước vừa đủ cho ấm chén và phụ kiện thưởng trà.', N'phu-kien-ban-tra', N'Phụ kiện bàn trà', N'/images/product/khay-go.jpg', 1, 15, N'Active'),
        (N'Hộp đựng trà gỗ nắp kín', N'hop-dung-tra-go-nap-kin', N'Hộp trà gỗ nắp kín giúp bảo quản trà gọn gàng, giữ nét mộc mạc trên bàn tiếp khách.', N'phu-kien-ban-tra', N'Phụ kiện bàn trà', N'/images/product/hop-tra-go.jpg', 0, 16, N'Active')
) AS source (Name, Slug, Description, CategorySlug, Category, ImageUrl, IsFeatured, SortOrder, Status)
ON target.Slug = source.Slug
WHEN MATCHED THEN
    UPDATE SET
        Name = source.Name,
        Description = source.Description,
        CategoryId = (SELECT Id FROM dbo.ProductCategories WHERE Slug = source.CategorySlug),
        Category = source.Category,
        ImageUrl = source.ImageUrl,
        IsFeatured = source.IsFeatured,
        SortOrder = source.SortOrder,
        Status = source.Status
WHEN NOT MATCHED THEN
    INSERT (Name, Slug, Description, CategoryId, Category, ImageUrl, IsFeatured, SortOrder, Status)
    VALUES
    (
        source.Name,
        source.Slug,
        source.Description,
        (SELECT Id FROM dbo.ProductCategories WHERE Slug = source.CategorySlug),
        source.Category,
        source.ImageUrl,
        source.IsFeatured,
        source.SortOrder,
        source.Status
    );
GO

UPDATE p
SET CategoryId = c.Id
FROM dbo.Products p
INNER JOIN dbo.ProductCategories c ON p.Category = c.Name
WHERE p.CategoryId IS NULL;
GO
