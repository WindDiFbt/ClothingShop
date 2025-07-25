USE [master]
GO
/****** Object:  Database [ClothingShop_PRN232_G5]    Script Date: 7/21/2025 9:54:55 PM ******/
CREATE DATABASE [ClothingShop_PRN232_G5]
GO
USE [ClothingShop_PRN232_G5]
GO
/****** Object:  Table [dbo].[cart]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[total_amount] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart_detail]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_detail](
	[cart_id] [uniqueidentifier] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[quantity] [int] NULL,
	[total_price] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[cart_id] ASC,
	[product_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[feedback]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[feedback](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[product_id] [bigint] NULL,
	[order_id] [uniqueidentifier] NOT NULL,
	[rating] [tinyint] NULL,
	[comment] [nvarchar](511) NULL,
	[create_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[image]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[image](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [bigint] NULL,
	[url] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order](
	[id] [uniqueidentifier] NOT NULL,
	[customer_id] [uniqueidentifier] NULL,
	[voucher_id] [bigint] NULL,
	[full_name] [nvarchar](127) NULL,
	[phone_number] [nvarchar](25) NULL,
	[address] [nvarchar](255) NULL,
	[note] [nvarchar](511) NULL,
	[order_date] [datetime] NULL,
	[status] [int] NULL,
	[payment_link] [nvarchar](max) NULL,
	[total_amount] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_details]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_details](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_id] [uniqueidentifier] NOT NULL,
	[product_id] [bigint] NULL,
	[quantity] [int] NULL,
	[unit_price] [int] NULL,
	[discount] [int] NULL,
	[total_price] [int] NULL,
	[status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[order_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_status](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orderdetail_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orderdetail_status](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[seller_id] [uniqueidentifier] NULL,
	[name] [nvarchar](255) NULL,
	[category_id] [int] NULL,
	[thumbnail_url] [varchar](255) NULL,
	[description] [nvarchar](max) NULL,
	[price] [int] NULL,
	[discount] [int] NULL,
	[status] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
	[NameUnsigned] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_status](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[product_variants]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[product_variants](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[product_id] [bigint] NULL,
	[size] [varchar](10) NULL,
	[quantity] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[productRejectionLog]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[productRejectionLog](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [bigint] NOT NULL,
	[reason] [nvarchar](255) NOT NULL,
	[rejected_at] [datetime] NULL,
	[resend_count] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[report]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[report](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[product_id] [bigint] NULL,
	[reason] [nvarchar](511) NULL,
	[status] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[report_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[report_status](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[roles]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] NOT NULL,
	[name] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [uniqueidentifier] NOT NULL,
	[user_name] [nvarchar](64) NULL,
	[email] [varchar](64) NULL,
	[password] [varchar](64) NULL,
	[status] [int] NULL,
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_gender]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_gender](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_roles]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NULL,
	[role_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_status](
	[id] [int] NOT NULL,
	[status_name] [varchar](15) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userinfo]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userinfo](
	[id] [uniqueidentifier] NOT NULL,
	[full_name] [nvarchar](127) NULL,
	[phone_number] [varchar](25) NULL,
	[avatar_url] [varchar](255) NULL,
	[gender] [int] NULL,
	[date_of_birth] [date] NULL,
	[address] [varchar](255) NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[code] [varchar](50) NULL,
	[type] [int] NULL,
	[value] [decimal](10, 2) NULL,
	[description] [nvarchar](255) NULL,
	[start_date] [datetime] NULL,
	[end_date] [datetime] NULL,
	[status] [int] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
	[usage_limit] [int] NULL,
	[usage_count] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher_status]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher_status](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher_type]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher_type](
	[id] [int] NOT NULL,
	[name] [varchar](25) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VoucherUsage]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VoucherUsage](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[voucher_id] [bigint] NOT NULL,
	[used_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[wishlist]    Script Date: 7/21/2025 9:54:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[wishlist](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[product_id] [bigint] NOT NULL,
	[is_deleted] [tinyint] NULL,
	[create_at] [datetime] NULL,
	[update_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'43f021fd-3f63-4f71-8f10-1bb06e19b4eb', N'92de3d6a-c464-48a2-86b3-04b8a789423e', 0, CAST(N'2025-07-21T06:52:31.883' AS DateTime), CAST(N'2025-07-21T06:52:31.883' AS DateTime))
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'056617ba-5a02-45bd-b018-5ef5d080bdac', N'bf403536-6c5e-4016-b0a9-37340dfc4df9', 0, CAST(N'2025-07-16T05:56:51.577' AS DateTime), CAST(N'2025-07-16T05:56:51.577' AS DateTime))
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'601909a7-3794-4c80-87a4-9e0b69d22e45', N'5400c558-7741-4b47-93c6-f5c23add1559', 0, CAST(N'2025-03-11T10:37:56.060' AS DateTime), CAST(N'2025-03-11T10:37:56.060' AS DateTime))
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'b6347503-f2e0-4dc0-89e5-aa3898a7ba1c', N'680fefa1-9463-40a3-9d48-594529ab96cf', 300000, CAST(N'2025-03-12T09:03:50.583' AS DateTime), CAST(N'2025-03-20T15:30:36.237' AS DateTime))
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'246068cc-f996-4e58-91b7-f15a88609c07', N'af3de66c-188d-4c2c-a568-12d75a40d0c4', 1800000, CAST(N'2025-03-28T16:03:28.927' AS DateTime), CAST(N'2025-03-28T16:03:28.967' AS DateTime))
INSERT [dbo].[cart] ([id], [user_id], [total_amount], [create_at], [update_at]) VALUES (N'4a57f657-aa77-4814-8ccc-f1bac80c4979', N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', 0, CAST(N'2025-07-16T06:02:28.203' AS DateTime), CAST(N'2025-07-16T06:02:28.203' AS DateTime))
GO
INSERT [dbo].[cart_detail] ([cart_id], [product_id], [quantity], [total_price], [create_at], [update_at]) VALUES (N'056617ba-5a02-45bd-b018-5ef5d080bdac', 1, 2, 0, CAST(N'2025-07-16T05:59:15.343' AS DateTime), CAST(N'2025-07-16T05:59:25.667' AS DateTime))
INSERT [dbo].[cart_detail] ([cart_id], [product_id], [quantity], [total_price], [create_at], [update_at]) VALUES (N'056617ba-5a02-45bd-b018-5ef5d080bdac', 2, 1, 0, CAST(N'2025-07-16T05:59:20.223' AS DateTime), CAST(N'2025-07-16T05:59:20.223' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[category] ON 

INSERT [dbo].[category] ([id], [name]) VALUES (1, N'Quần')
INSERT [dbo].[category] ([id], [name]) VALUES (2, N'Áo')
INSERT [dbo].[category] ([id], [name]) VALUES (3, N'Giày dép')
INSERT [dbo].[category] ([id], [name]) VALUES (4, N'Phụ kiện')
INSERT [dbo].[category] ([id], [name]) VALUES (5, N'Túi xách')
SET IDENTITY_INSERT [dbo].[category] OFF
GO
SET IDENTITY_INSERT [dbo].[feedback] ON 

INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (1, N'680fefa1-9463-40a3-9d48-594529ab96cf', 1, N'680fefa1-9463-40a3-9d48-594529ab16cf', 5, N'Sản phẩm chất lượng, rất đáng tiền!', CAST(N'2025-02-26T10:00:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (2, N'680fefa1-9463-40a3-9d48-594529ab96cf', 5, N'680fefa1-9463-40a3-9d48-594529ab16cf', 4, N'Giao hàng nhanh nhưng đóng gói hơi sơ sài.', CAST(N'2025-02-26T10:05:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (3, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', 2, N'680fefa1-9463-40a3-9d48-594529ab26cf', 5, N'Quần jeans rất đẹp, vừa vặn.', CAST(N'2025-02-26T11:00:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (4, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', 4, N'680fefa1-9463-40a3-9d48-594529ab26cf', 3, N'Sản phẩm đẹp nhưng giao hàng hơi chậm.', CAST(N'2025-02-26T11:15:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (5, N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', 3, N'680fefa1-9463-40a3-9d48-594529ab36cf', 4, N'Áo sơ mi vải mịn, mặc rất thích.', CAST(N'2025-02-26T12:30:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (6, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', 6, N'680fefa1-9463-40a3-9d48-594529ab46cf', 5, N'Túi xách rất đẹp, phù hợp với giá tiền.', CAST(N'2025-02-26T13:45:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (7, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', 10, N'680fefa1-9463-40a3-9d48-594529ab46cf', 4, N'Đồng hồ khá đẹp nhưng dây hơi cứng.', CAST(N'2025-02-26T14:00:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (8, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', 1, N'680fefa1-9463-40a3-9d48-594529ab26cf', 5, N'Good!', CAST(N'2025-03-12T11:00:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (9, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', 1, N'680fefa1-9463-40a3-9d48-594529ab46cf', 4, N'Sản phẩm rất tốt nhưng giá thành cao!', CAST(N'2025-03-11T13:20:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (10, N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', 1, N'680fefa1-9463-40a3-9d48-594529ab36cf', 3, N'Sản phẩm bị lỗi nhẹ', CAST(N'2025-03-11T13:20:00.000' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (11, N'680fefa1-9463-40a3-9d48-594529ab96cf', 10, N'4397c55c-14ca-46f8-9cb6-7cd0c56ddc00', 5, N'Good', CAST(N'2025-03-14T23:52:54.723' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (12, N'680fefa1-9463-40a3-9d48-594529ab96cf', 1, N'1174f72a-9024-4cce-97ab-e52973c76604', 1, NULL, CAST(N'2025-03-15T00:33:54.650' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (13, N'af3de66c-188d-4c2c-a568-12d75a40d0c4', 6, N'13a1c582-ef71-4a49-bf0d-bb31209e985c', 5, N'Good', CAST(N'2025-03-28T22:59:12.463' AS DateTime))
INSERT [dbo].[feedback] ([id], [user_id], [product_id], [order_id], [rating], [comment], [create_at]) VALUES (18, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', 5, N'680fefa1-9463-40a3-9d48-594529ab26cf', 5, N'Good', CAST(N'2025-06-25T22:41:19.713' AS DateTime))
SET IDENTITY_INSERT [dbo].[feedback] OFF
GO
SET IDENTITY_INSERT [dbo].[image] ON 

INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (1, 1, N'https://4menshop.com/cache/image/300x400/images/thumbs/2025/02/ao-thun-co-tron-in-chu-dream-form-regular-at163_small-19113.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (2, 1, N'https://4menshop.com/images/thumbs/2025/02/ao-thun-co-tron-in-chu-eclectic-prep-form-regular-at164-19114-slide-products-67ab1908933e6.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (3, 1, N'https://4menshop.com/images/thumbs/2025/02/ao-thun-co-tron-in-chu-eclectic-prep-form-regular-at164-19114-slide-products-67ab1908d58d1.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (4, 2, N'https://product.hstatic.net/200000886795/product/quan-jeans-nam-insidemen-cropped-ijn0410z__12__490cc37aed984869ad5c5c09217dbe91.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (5, 2, N'https://product.hstatic.net/200000886795/product/quan-jeans-nam-insidemen-cropped-ijn0410z__11__1e033bd7f5a446f9b6aba9377455e13f.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (6, 2, N'https://product.hstatic.net/200000886795/product/quan-jeans-nam-insidemen-cropped-ijn0410z__10__bc0f4c3311474c19b239f1c71ff2b57c.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (7, 2, N'https://product.hstatic.net/200000886795/product/quan-jeans-nam-insidemen-cropped-ijn0410z__9__8253d53d148746a8afdf49452fa34ac7.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (8, 3, N'https://cdn.kkfashion.vn/25220-large_default/ao-so-mi-nu-cong-so-mau-trang-tay-dai-asm15-12.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (9, 4, N'https://pos.nvncdn.com/80a557-93682/ps/20230710_8xEuqh8NRG.png')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (10, 5, N'https://myshoes.vn/image/cache/catalog/2025/nike/giay-nike-pegasus-41-nu-phantom-01-500x500.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (11, 5, N'https://myshoes.vn/image/cache/catalog/2025/nike/giay-nike-pegasus-41-nu-phantom-02-800x800.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (12, 5, N'https://myshoes.vn/image/cache/catalog/2025/nike/giay-nike-pegasus-41-nu-phantom-04-800x800.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (13, 5, N'https://myshoes.vn/image/cache/catalog/2025/nike/giay-nike-pegasus-41-nu-phantom-04-800x800.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (17, 7, N'https://product.hstatic.net/1000360022/product/id-005769a_9d320dcfce3f4e5bb993a1ac13304c4f_master.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (18, 8, N'https://bizweb.dktcdn.net/100/287/440/products/mu-luoi-trai-local-brand-dep-mau-be-1.jpg?v=1644822065327')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (19, 9, N'https://salt.tikicdn.com/cache/280x280/ts/product/9a/7c/6f/9edffc4f2ccd5be435fd2a0a784eeaa8.JPG')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (20, 10, N'https://donghoduyanh.com/images/products/2023/07/31/large/an8201-57l_1690775073.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (21, 6, N'https://res.cloudinary.com/dvyswwdcz/image/upload/v1743177744/r61fup6zraoc2t2po12q.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (23, 6, N'https://res.cloudinary.com/dvyswwdcz/image/upload/v1743177758/cohrsn2xkcftkaiuhjnq.jpg')
INSERT [dbo].[image] ([id], [product_id], [url]) VALUES (24, 6, N'https://res.cloudinary.com/dvyswwdcz/image/upload/v1743177769/e5uparkwcno7dwu7nqcj.jpg')
SET IDENTITY_INSERT [dbo].[image] OFF
GO
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'faa20d26-a252-4cb5-8a85-099b0ae884de', N'5400c558-7741-4b47-93c6-f5c23add1558', NULL, N'Sarah Green', N'123-456-1095', N'Address 678', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1260000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'95c4d171-6db9-4163-a81c-4537e7f0d154', N'e8b1796b-ee6c-4bb9-a540-d4b5b1fc3b7d', NULL, N'Christopher Rodriguez', N'123-456-9237', N'Address 129', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 900000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'f7bc5024-c7af-4b47-9b90-4628e276af6c', N'680fefa1-9463-40a3-9d48-594529ab96cf', NULL, N'Nguyen Van C', N'93021093019', N'Ninh Binh', N'none', CAST(N'2025-03-20T22:03:41.697' AS DateTime), 1, N'#', 250000, CAST(N'2025-03-20T22:03:41.697' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'a1a25a81-0793-442f-815a-4e1bb134b4be', N'af3de66c-188d-4c2c-a568-12d75a40d0c4', 2, N'Jane Allen', N'123-456-1752', N'Address 383', N'Give me a cuc', CAST(N'2025-03-28T23:03:52.980' AS DateTime), 2, N'https://test-payment.momo.vn/v2/gateway/pay?t=TU9NT3xhMWEyNWE4MS0wNzkzLTQ0MmYtODE1YS00ZTFiYjEzNGI0YmU&s=a4827306816462836396e78a65dd276acbf157737f9a96702eb06239b8d6646c', 1620000, CAST(N'2025-03-28T23:03:52.980' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'991a483e-3f6d-45d9-8521-54de5a36746a', N'e896f497-60f8-4706-ba6c-ea05dbbe2c8e', NULL, N'John Walker', N'123-456-5868', N'Address 503', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 200000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab16cf', N'680fefa1-9463-40a3-9d48-594529ab96cf', NULL, N'Đặng Văn E', N'0987654321', N'Hà Nội', N'', CAST(N'2025-02-25T16:31:25.130' AS DateTime), 4, N'#', 950000, CAST(N'2025-02-25T16:31:25.130' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab26cf', N'dde923de-6b2a-4104-a293-6da7aaa68ef3', NULL, N'Trần Thị B', N'0977654321', N'TP.HCM', N'', CAST(N'2025-02-25T16:31:25.130' AS DateTime), 4, N'#', 1260000, CAST(N'2025-02-25T16:31:25.130' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab36cf', N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', NULL, N'Phạm Văn C', N'0967654321', N'Đà Nẵng', N'', CAST(N'2025-02-25T16:31:25.130' AS DateTime), 4, N'#', 425000, CAST(N'2025-02-25T16:31:25.130' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab46cf', N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', NULL, N'Nguyễn Văn A', N'0957654321', N'Cần Thơ', N'', CAST(N'2025-02-25T16:31:25.130' AS DateTime), 4, N'#', 1738000, CAST(N'2025-02-25T16:31:25.130' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab56cf', N'5400c558-7741-4b47-93c6-f5c23add1559', NULL, N'Trần Tuấn Anh', N'0344191620', N'Hà Nội', N'', CAST(N'2025-03-11T10:37:56.027' AS DateTime), 4, N'#', 1738000, CAST(N'2025-03-11T10:37:56.027' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'3a387742-5071-49be-9689-5daa83140cb6', N'fd2a304b-5b9d-4006-ab92-e761e5b83c72', NULL, N'Elizabeth Walker', N'123-456-1308', N'Address 79', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1356000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'94808df8-5a21-44be-b373-61953d959a3f', N'680fefa1-9463-40a3-9d48-594529ab96cf', 2, N'Nguyen Van C', N'93021093019', N'Ninh Binh', N'mmmm', CAST(N'2025-03-20T21:44:07.883' AS DateTime), 2, N'#', 270000, CAST(N'2025-03-20T21:44:07.883' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'b75fea34-9c05-4599-acf9-6ad4d3ba9b98', N'04e730c4-360a-4912-9143-efdfd35325c7', NULL, N'Christopher Johnson', N'123-456-8131', N'Address 447', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 360000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'cb941009-3af3-44ee-9d4d-6dfcd65c6a63', N'680fefa1-9463-40a3-9d48-594529ab96cf', NULL, N'Charles Hall', N'123-456-8585', N'Address 673', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 142500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'54317f8b-8f30-4dc8-81b6-72c0d0a85f28', N'e896f497-60f8-4706-ba6c-ea05dbbe2c8e', NULL, N'John Walker', N'123-456-5868', N'Address 503', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 2316000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'0800940a-6e76-4801-9f20-763ae9161cc7', N'8140a1d5-8e8c-4124-8ee1-8b70916882a0', NULL, N'Michael King', N'123-456-9213', N'Address 44', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 900000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'b1f70786-9632-450d-ab6c-79d77e4ad179', N'b7ef1ef7-b6a1-4c54-ac49-d14873c97e95', NULL, N'Christopher Martinez', N'123-456-6854', N'Address 947', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1756000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'4397c55c-14ca-46f8-9cb6-7cd0c56ddc00', N'680fefa1-9463-40a3-9d48-594529ab96cf', NULL, N'Nguyen Van A', N'93021093019', N'Ha Noi', N'none', CAST(N'2025-03-14T22:04:57.013' AS DateTime), 4, N'#', 1000, CAST(N'2025-03-14T22:04:57.013' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'a069548b-1f03-43fc-9e58-8854a288f805', N'c95a5de1-81bb-4f44-a629-fd5ae7571bb4', NULL, N'William Lee', N'123-456-2316', N'Address 721', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 927500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'6a09dec1-394d-4be8-bcd4-a7579eba879a', N'0af3ecf0-f016-424f-96d5-4470171c3309', NULL, N'Nancy Hall', N'123-456-556', N'Address 551', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 400000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'f340792b-d233-48fd-8531-b195b47b948f', N'e8b1796b-ee6c-4bb9-a540-d4b5b1fc3b7d', NULL, N'Christopher Rodriguez', N'123-456-9237', N'Address 129', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 360000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'f25b62c9-d815-4196-8632-b2a1472f8a59', N'c95a5de1-81bb-4f44-a629-fd5ae7571bb4', NULL, N'William Lee', N'123-456-2316', N'Address 721', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 752500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'4b9ae5e1-0573-4783-b999-b9b8428b26a5', N'e603102c-e6f7-47f8-9083-ec330062ab54', NULL, N'Emily Walker', N'123-456-7443', N'Address 32', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1092500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'13a1c582-ef71-4a49-bf0d-bb31209e985c', N'af3de66c-188d-4c2c-a568-12d75a40d0c4', NULL, N'Jane Allen', N'123-456-1752', N'Address 383', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1042500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'ede40297-a183-47b5-93f8-bb78aa93851b', N'b7ef1ef7-b6a1-4c54-ac49-d14873c97e95', NULL, N'Christopher Martinez', N'123-456-6854', N'Address 947', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 785000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'fcf0024b-d0fb-40c8-9fd7-c233045b4a3c', N'bf403536-6c5e-4016-b0a9-37340dfc4df9', NULL, N'Nguyen Phong', N'0366645489', N'Ha Noi', N'', CAST(N'2025-07-16T05:59:00.050' AS DateTime), 1, N'#', 1000000, CAST(N'2025-07-16T05:59:00.050' AS DateTime), CAST(N'2025-07-16T05:59:00.050' AS DateTime))
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'cc2b0c54-2456-4228-9725-c7eebd529eb1', N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', NULL, N'Nguyen A', N'03631458999', N'Ha Noi', N'', CAST(N'2025-07-16T06:02:43.450' AS DateTime), 1, N'#', 250000, CAST(N'2025-07-16T06:02:43.450' AS DateTime), CAST(N'2025-07-16T06:02:43.450' AS DateTime))
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'1ff6b79f-1c42-4032-ad01-cb79e286a5d4', N'92de3d6a-c464-48a2-86b3-04b8a789423e', NULL, N'phong', N'0312466998', N'Ha Noi', N'', CAST(N'2025-07-21T06:52:53.010' AS DateTime), 1, N'#', 250000, CAST(N'2025-07-21T06:52:53.010' AS DateTime), CAST(N'2025-07-21T06:52:53.010' AS DateTime))
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'a17a7dcc-7cbc-44fb-8e9b-cdf331831ffd', N'c5104052-5081-477b-8b17-cc7c9865f834', NULL, N'William Young', N'123-456-7580', N'Address 409', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 2116000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'689969da-234b-42f3-9710-d73e9e35133b', N'c5104052-5081-477b-8b17-cc7c9865f834', NULL, N'William Young', N'123-456-7580', N'Address 409', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 747000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'7bae99c3-2d64-4540-b334-d76a06143f2c', N'680fefa1-9463-40a3-9d48-594529ab96cf', 7, N'Nguyen Van C', N'93021093019', N'Ninh Binh', N'none', CAST(N'2025-03-20T22:34:02.943' AS DateTime), 1, N'#', 290000, CAST(N'2025-03-20T22:34:02.943' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'95f7b0aa-14da-4be2-b6ab-d9bda3a77a1d', N'58558870-b193-4ed9-b7f3-0e47e49a123f', NULL, N'Michael Johnson', N'123-456-2127', N'Address 873', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 1558500, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'1174f72a-9024-4cce-97ab-e52973c76604', N'680fefa1-9463-40a3-9d48-594529ab96cf', NULL, N'Nguyen Van C', N'93021093019', N'Ninh Binh', N'none', CAST(N'2025-03-14T23:54:00.833' AS DateTime), 4, N'#', 1000, CAST(N'2025-03-14T23:54:00.833' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', N'680fefa1-9463-40a3-9d48-594529ab96cf', 2, N'Nguyen Van C', N'93021093019', N'Ninh Binh', N'meo', CAST(N'2025-03-20T21:41:44.663' AS DateTime), 1, N'#', 675000, CAST(N'2025-03-20T21:41:44.663' AS DateTime), NULL)
INSERT [dbo].[order] ([id], [customer_id], [voucher_id], [full_name], [phone_number], [address], [note], [order_date], [status], [payment_link], [total_amount], [create_at], [update_at]) VALUES (N'fbf83b46-65d9-4c3c-92cf-ff7adcace796', N'bfcd2888-a830-4483-af00-f8de363397aa', NULL, N'Karen Green', N'123-456-9799', N'Address 420', NULL, CAST(N'2025-03-28T22:15:07.257' AS DateTime), 4, N'#', 360000, CAST(N'2025-03-28T22:15:07.257' AS DateTime), NULL)
GO
SET IDENTITY_INSERT [dbo].[order_details] ON 

INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (15, N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', 1, 1, 250000, 0, 250000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (16, N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', 2, 1, 500000, 0, 500000, 5)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (17, N'94808df8-5a21-44be-b373-61953d959a3f', 3, 1, 300000, 0, 300000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (22, N'f7bc5024-c7af-4b47-9b90-4628e276af6c', 1, 1, 250000, 0, 250000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (23, N'7bae99c3-2d64-4540-b334-d76a06143f2c', 3, 1, 300000, 0, 300000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (63, N'faa20d26-a252-4cb5-8a85-099b0ae884de', 2, 3, 500000, 0, 1500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (64, N'faa20d26-a252-4cb5-8a85-099b0ae884de', 4, 3, 450000, 0, 1350000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (65, N'95c4d171-6db9-4163-a81c-4537e7f0d154', 9, 3, 350000, 0, 1050000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (66, N'95c4d171-6db9-4163-a81c-4537e7f0d154', 10, 1, 1200000, 0, 1200000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (67, N'95c4d171-6db9-4163-a81c-4537e7f0d154', 6, 2, 900000, 0, 1800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (68, N'f7bc5024-c7af-4b47-9b90-4628e276af6c', 11, 5, 200000, 0, 1000000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (69, N'991a483e-3f6d-45d9-8521-54de5a36746a', 11, 5, 200000, 0, 1000000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (70, N'991a483e-3f6d-45d9-8521-54de5a36746a', 8, 1, 150000, 0, 150000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (71, N'991a483e-3f6d-45d9-8521-54de5a36746a', 7, 5, 400000, 0, 2000000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (72, N'680fefa1-9463-40a3-9d48-594529ab16cf', 9, 4, 350000, 0, 1400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (73, N'680fefa1-9463-40a3-9d48-594529ab26cf', 6, 3, 900000, 0, 2700000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (74, N'680fefa1-9463-40a3-9d48-594529ab26cf', 5, 2, 700000, 0, 1400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (75, N'680fefa1-9463-40a3-9d48-594529ab36cf', 8, 1, 150000, 0, 150000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (76, N'680fefa1-9463-40a3-9d48-594529ab36cf', 7, 2, 400000, 0, 800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (77, N'680fefa1-9463-40a3-9d48-594529ab36cf', 7, 4, 400000, 0, 1600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (78, N'680fefa1-9463-40a3-9d48-594529ab46cf', 10, 3, 1200000, 0, 3600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (79, N'680fefa1-9463-40a3-9d48-594529ab46cf', 3, 1, 300000, 0, 300000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (80, N'680fefa1-9463-40a3-9d48-594529ab56cf', 2, 2, 500000, 0, 1000000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (81, N'680fefa1-9463-40a3-9d48-594529ab56cf', 3, 3, 300000, 0, 900000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (82, N'3a387742-5071-49be-9689-5daa83140cb6', 5, 4, 700000, 0, 2800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (83, N'3a387742-5071-49be-9689-5daa83140cb6', 8, 2, 150000, 0, 300000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (84, N'3a387742-5071-49be-9689-5daa83140cb6', 6, 2, 900000, 0, 1800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (85, N'94808df8-5a21-44be-b373-61953d959a3f', 4, 2, 450000, 0, 900000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (86, N'94808df8-5a21-44be-b373-61953d959a3f', 8, 3, 150000, 0, 450000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (87, N'94808df8-5a21-44be-b373-61953d959a3f', 7, 4, 400000, 0, 1600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (88, N'b75fea34-9c05-4599-acf9-6ad4d3ba9b98', 3, 2, 300000, 0, 600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (89, N'cb941009-3af3-44ee-9d4d-6dfcd65c6a63', 3, 4, 300000, 0, 1200000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (90, N'54317f8b-8f30-4dc8-81b6-72c0d0a85f28', 9, 4, 350000, 0, 1400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (91, N'54317f8b-8f30-4dc8-81b6-72c0d0a85f28', 11, 2, 200000, 0, 400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (92, N'0800940a-6e76-4801-9f20-763ae9161cc7', 11, 1, 200000, 0, 200000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (93, N'0800940a-6e76-4801-9f20-763ae9161cc7', 1, 5, 250000, 0, 1250000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (94, N'b1f70786-9632-450d-ab6c-79d77e4ad179', 7, 3, 400000, 0, 1200000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (95, N'b1f70786-9632-450d-ab6c-79d77e4ad179', 2, 3, 500000, 0, 1500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (96, N'b1f70786-9632-450d-ab6c-79d77e4ad179', 3, 5, 300000, 0, 1500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (97, N'4397c55c-14ca-46f8-9cb6-7cd0c56ddc00', 1, 1, 250000, 0, 250000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (98, N'a069548b-1f03-43fc-9e58-8854a288f805', 10, 4, 1200000, 0, 4800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (99, N'6a09dec1-394d-4be8-bcd4-a7579eba879a', 2, 4, 500000, 0, 2000000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (100, N'f340792b-d233-48fd-8531-b195b47b948f', 8, 2, 150000, 0, 300000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (101, N'f340792b-d233-48fd-8531-b195b47b948f', 9, 2, 350000, 0, 700000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (102, N'f25b62c9-d815-4196-8632-b2a1472f8a59', 6, 3, 900000, 0, 2700000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (103, N'f25b62c9-d815-4196-8632-b2a1472f8a59', 4, 1, 450000, 0, 450000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (104, N'f25b62c9-d815-4196-8632-b2a1472f8a59', 5, 2, 700000, 0, 1400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (105, N'4b9ae5e1-0573-4783-b999-b9b8428b26a5', 7, 1, 400000, 0, 400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (106, N'13a1c582-ef71-4a49-bf0d-bb31209e985c', 6, 5, 900000, 0, 4500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (107, N'13a1c582-ef71-4a49-bf0d-bb31209e985c', 5, 3, 700000, 0, 2100000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (108, N'13a1c582-ef71-4a49-bf0d-bb31209e985c', 6, 3, 900000, 0, 2700000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (109, N'ede40297-a183-47b5-93f8-bb78aa93851b', 4, 2, 450000, 0, 900000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (110, N'ede40297-a183-47b5-93f8-bb78aa93851b', 6, 3, 900000, 0, 2700000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (111, N'ede40297-a183-47b5-93f8-bb78aa93851b', 8, 4, 150000, 0, 600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (112, N'a17a7dcc-7cbc-44fb-8e9b-cdf331831ffd', 2, 1, 500000, 0, 500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (113, N'a17a7dcc-7cbc-44fb-8e9b-cdf331831ffd', 10, 2, 1200000, 0, 2400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (114, N'689969da-234b-42f3-9710-d73e9e35133b', 2, 3, 500000, 0, 1500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (115, N'7bae99c3-2d64-4540-b334-d76a06143f2c', 4, 1, 450000, 0, 450000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (116, N'7bae99c3-2d64-4540-b334-d76a06143f2c', 5, 2, 700000, 0, 1400000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (117, N'7bae99c3-2d64-4540-b334-d76a06143f2c', 7, 4, 400000, 0, 1600000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (118, N'95f7b0aa-14da-4be2-b6ab-d9bda3a77a1d', 5, 4, 700000, 0, 2800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (119, N'1174f72a-9024-4cce-97ab-e52973c76604', 5, 5, 700000, 0, 3500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (120, N'1174f72a-9024-4cce-97ab-e52973c76604', 1, 1, 250000, 0, 250000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (121, N'1174f72a-9024-4cce-97ab-e52973c76604', 4, 4, 450000, 0, 1800000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (122, N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', 1, 2, 250000, 0, 500000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (123, N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', 8, 2, 150000, 0, 300000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (124, N'983e5f37-1553-45a8-9b6b-e98a4d0f4186', 1, 3, 250000, 0, 750000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (125, N'fbf83b46-65d9-4c3c-92cf-ff7adcace796', 6, 1, 900000, 0, 900000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (126, N'fbf83b46-65d9-4c3c-92cf-ff7adcace796', 9, 3, 350000, 0, 1050000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (127, N'fbf83b46-65d9-4c3c-92cf-ff7adcace796', 1, 3, 250000, 0, 750000, 4)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (128, N'a1a25a81-0793-442f-815a-4e1bb134b4be', 6, 2, 900000, 0, 1800000, 5)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (129, N'fcf0024b-d0fb-40c8-9fd7-c233045b4a3c', 1, 2, 250000, NULL, 500000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (130, N'fcf0024b-d0fb-40c8-9fd7-c233045b4a3c', 2, 1, 500000, NULL, 500000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (131, N'cc2b0c54-2456-4228-9725-c7eebd529eb1', 1, 1, 250000, NULL, 250000, 1)
INSERT [dbo].[order_details] ([id], [order_id], [product_id], [quantity], [unit_price], [discount], [total_price], [status]) VALUES (132, N'1ff6b79f-1c42-4032-ad01-cb79e286a5d4', 1, 1, 250000, NULL, 250000, 1)
SET IDENTITY_INSERT [dbo].[order_details] OFF
GO
INSERT [dbo].[order_status] ([id], [name]) VALUES (1, N'PENDING CONFIRMATION')
INSERT [dbo].[order_status] ([id], [name]) VALUES (2, N'CONFIRMED')
INSERT [dbo].[order_status] ([id], [name]) VALUES (3, N'SHIPPING')
INSERT [dbo].[order_status] ([id], [name]) VALUES (4, N'DELIVERED')
INSERT [dbo].[order_status] ([id], [name]) VALUES (5, N'CANCELLED')
INSERT [dbo].[order_status] ([id], [name]) VALUES (6, N'RETURNED')
GO
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (1, N'PENDING CONFIRMATION')
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (2, N'CONFIRMED')
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (3, N'SHIPPING')
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (4, N'DELIVERED')
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (5, N'CANCELLED')
INSERT [dbo].[orderdetail_status] ([id], [name]) VALUES (6, N'RETURNED')
GO
SET IDENTITY_INSERT [dbo].[product] ON 

INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (1, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Áo Thun Nam GENTO', 2, N'https://4menshop.com/cache/image/300x400/images/thumbs/2025/02/ao-thun-co-tron-in-chu-dream-form-regular-at163_small-19113.jpg', N'Áo thun nam cao cấp', 250000, 0, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'ao thun nam gento')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (2, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Quần Jeans Nam Devis', 1, N'https://cdn.boo.vn/media/catalog/product/1/_/1.2.21.2.23.001.124.01.60600034_1__4.jpg', N'Quần jeans nam trẻ trung', 500000, 15, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'quan jeans nam devis')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (3, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Áo Sơ Mi Nữ GENTO', 2, N'https://cdn.kkfashion.vn/25220-large_default/ao-so-mi-nu-cong-so-mau-trang-tay-dai-asm15-12.jpg', N'Áo sơ mi nữ thanh lịch', 300000, 0, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'ao so mi nu gento')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (4, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Váy Đầm Nữ GENTO', 1, N'https://pos.nvncdn.com/80a557-93682/ps/20230710_8xEuqh8NRG.png', N'Váy đầm nữ thời trang', 450000, 20, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'vay dam nu gento')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (5, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Giày Sneaker NIKE', 3, N'https://myshoes.vn/image/cache/catalog/2025/nike/giay-nike-pegasus-41-nu-phantom-01-500x500.jpg', N'Giày sneaker unisex', 700000, 0, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'giay sneaker nike')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (6, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Túi Xách Nữ GENTO', 5, N'https://www.vascara.com/uploads/cms_productmedia/2025/January/23/tui-xach-tay-quai-doi-van-da-phoi-tuong-phan---tot-0193---mau-be__80307__1737606720-medium.jpg', N'Túi xách nữ hàng hiệu', 900000, 0, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'tui xach nu gento')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (7, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Áo Hoodie Nam Devis', 2, N'https://product.hstatic.net/1000360022/product/id-005769a_9d320dcfce3f4e5bb993a1ac13304c4f_master.jpg', N'Áo hoodie ấm áp', 400000, 10, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'ao hoodie nam devis')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (8, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Mũ Lưỡi Trai Devis', 4, N'https://bizweb.dktcdn.net/100/287/440/products/mu-luoi-trai-local-brand-dep-mau-be-1.jpg?v=1644822065327', N'Mũ lưỡi trai phong cách', 150000, 5, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'mu luoi trai devis')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (9, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Kính Râm VSP303', 4, N'https://salt.tikicdn.com/cache/280x280/ts/product/9a/7c/6f/9edffc4f2ccd5be435fd2a0a784eeaa8.JPG', N'Kính râm chống UV', 350000, 8, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'kinh ram vsp303')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (10, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Đồng Hồ Nam Citizen AN8201-57L', 4, N'https://donghoduyanh.com/images/products/2023/07/31/large/an8201-57l_1690775073.jpg', N'Đồng hồ nam thời trang', 1200000, 12, 1, CAST(N'2025-02-19T17:01:27.673' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'dong ho nam citizen an8201-57l')
INSERT [dbo].[product] ([id], [seller_id], [name], [category_id], [thumbnail_url], [description], [price], [discount], [status], [create_at], [update_at], [NameUnsigned]) VALUES (11, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'Áo thun CỔ V vải COTTON', 2, N'https://lados.vn/wp-content/uploads/2024/07/z5625418105785-f84f4ca9deba934a353bf32f85697ff7-1720759573945.jpeg', N'Chất liệu cotton interlock 250gsm
Co giãn tốt, mặc cực thoải mái, thấm hút mồ hôi tốt
Thiết kế theo form rộng vừa, đơn giản, dễ mặc.', 200000, 0, 2, CAST(N'2025-03-21T09:18:24.207' AS DateTime), CAST(N'2025-02-19T17:01:27.673' AS DateTime), N'ao thun co v vai cotton')
SET IDENTITY_INSERT [dbo].[product] OFF
GO
INSERT [dbo].[product_status] ([id], [name]) VALUES (1, N'APPROVED')
INSERT [dbo].[product_status] ([id], [name]) VALUES (2, N'UNAPPROVED')
INSERT [dbo].[product_status] ([id], [name]) VALUES (3, N'REJECTED')
GO
SET IDENTITY_INSERT [dbo].[product_variants] ON 

INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (1, 1, N'S', 16)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (2, 1, N'M', 30)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (3, 1, N'L', 25)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (4, 1, N'XL', 15)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (5, 2, N'29', 14)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (6, 2, N'30', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (7, 2, N'31', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (8, 2, N'32', 10)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (9, 3, N'S', 25)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (10, 3, N'M', 30)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (11, 3, N'L', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (12, 4, N'S', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (13, 4, N'M', 25)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (14, 4, N'L', 15)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (15, 5, N'39', 10)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (16, 5, N'40', 15)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (17, 5, N'41', 12)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (18, 5, N'42', 10)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (19, 6, N'Free', 50)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (20, 7, N'M', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (21, 7, N'L', 15)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (22, 7, N'XL', 10)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (23, 8, N'Free', 40)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (24, 9, N'Free', 35)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (25, 10, N'Free', 20)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (26, 11, N'M', 30)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (27, 11, N'L', 25)
INSERT [dbo].[product_variants] ([id], [product_id], [size], [quantity]) VALUES (28, 11, N'XL', 15)
SET IDENTITY_INSERT [dbo].[product_variants] OFF
GO
INSERT [dbo].[report_status] ([id], [name]) VALUES (1, N'PENDING')
INSERT [dbo].[report_status] ([id], [name]) VALUES (2, N'IN_PROGRESS')
INSERT [dbo].[report_status] ([id], [name]) VALUES (3, N'RESOLVED')
INSERT [dbo].[report_status] ([id], [name]) VALUES (4, N'REJECTED')
GO
INSERT [dbo].[roles] ([id], [name]) VALUES (0, N'ADMIN_BUSINESS')
INSERT [dbo].[roles] ([id], [name]) VALUES (1, N'ADMIN')
INSERT [dbo].[roles] ([id], [name]) VALUES (2, N'SELLER')
INSERT [dbo].[roles] ([id], [name]) VALUES (3, N'CUSTOMER')
GO
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'92de3d6a-c464-48a2-86b3-04b8a789423e', N'user_14', N'user_14@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T06:22:57.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'58558870-b193-4ed9-b7f3-0e47e49a123f', N'user_4', N'user_4@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T18:09:56.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'af3de66c-188d-4c2c-a568-12d75a40d0c4', N'Emily Davis', N'emily.davis@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T09:28:04.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'5ee2958e-10ad-4a1c-b92a-1b85e205a005', N'Michael Brown', N'michael.brown@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T07:19:57.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'96bfce1e-92ae-4cfe-b5e7-3528eaab7780', N'user_15', N'user_15@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T04:39:50.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'd466627b-bbfc-4e18-840d-366c4d280554', N'user_8', N'user_8@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T09:28:29.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'bf403536-6c5e-4016-b0a9-37340dfc4df9', N'Phong12345', N'phongghast@gmail.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-07-16T05:56:35.793' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'0af3ecf0-f016-424f-96d5-4470171c3309', N'user_3', N'user_3@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T17:56:54.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'eb93af8b-fca5-47ab-88a9-44bc37e32839', N'Barbara Walker', N'barbara.walker@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T00:39:12.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'39ec5065-ab3a-47be-94be-5062071bce22', N'Charles King', N'charles.king@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T17:07:51.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'ede7014a-0a7a-4da8-b8ab-558ebd728fcc', N'user_12', N'user_12@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T15:00:54.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'ad184c16-bedc-4f18-a5be-55be523de207', N'Joseph Hall', N'joseph.hall@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T08:51:49.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab96cf', N'dangvan_e', N'dangvane@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'f8997bcb-ce9e-473b-aafc-5b41aa1e6cf2', N'Joseph Hall', N'joseph.hall@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T15:20:08.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'3e3320c2-2823-45f6-be4d-5cb23ee4820f', N'user_11', N'user_11@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T11:11:44.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'tranthib', N'tranthib@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'2342c522-ac20-41b5-a68a-6f5aff04bf55', N'user_9', N'user_9@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T01:42:19.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'0c7eff3f-829d-48ec-b013-7215ecbbb770', N'Patricia Rodriguez', N'patricia.rodriguez@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T00:40:18.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'20385105-c243-48bf-8626-7795cb91ff56', N'user_18', N'user_18@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T19:17:34.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'3a1a07a5-6d7c-49e1-a8bb-79ed2c4c05d1', N'user_10', N'user_10@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T03:58:20.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'8140a1d5-8e8c-4124-8ee1-8b70916882a0', N'user_7', N'user_7@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 3, CAST(N'2025-03-28T09:25:42.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'2183b427-cd87-49ec-b9a0-8d6786c2d68a', N'Christopher Lee', N'christopher.lee@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T02:03:53.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'338370fd-a839-40c0-8fbd-94724416b989', N'Robert Johnson', N'robert.johnson@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T02:34:48.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', N'phamvan_c', N'phamvanc@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'nguyenvan_a', N'nguyenvana@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'67d02878-3905-4e56-92ce-a8568195af84', N'Emily Davis', N'emily.davis@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T14:17:15.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'd9b48f0b-162e-47a4-81d3-afbab9cea3f2', N'Sarah Green', N'sarah.green@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T01:48:30.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'db66960d-da7b-4f1a-a055-b04d6cbcf334', N'admin_b', N'admin_b@gmail.com', N'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 1, CAST(N'2025-07-21T14:50:03.783' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'6fc34f42-46e4-4355-8dad-b17da99885ae', N'admin', N'admin@example.com', N'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'a5e88b90-ccf0-4c9f-be2c-b6d70ff3dd3b', N'Sarah Green', N'sarah.green@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T12:16:59.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'ae43c89a-98ef-413d-a1f1-b79ae852d17d', N'William Jones', N'william.jones@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T12:59:27.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'e536c8be-6c17-46d9-8cbb-bfa06ff6bca2', N'user_17', N'user_17@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T12:57:30.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'c5104052-5081-477b-8b17-cc7c9865f834', N'Karen Hernandez', N'karen.hernandez@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T04:10:55.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'b7ef1ef7-b6a1-4c54-ac49-d14873c97e95', N'user_13', N'user_13@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T05:23:59.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'e8b1796b-ee6c-4bb9-a540-d4b5b1fc3b7d', N'user_1', N'user_1@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T05:32:45.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'f9064543-5f37-46db-bb53-dc0acc53ceb1', N'user_5', N'user_5@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T20:47:59.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'55b49fd1-0dc3-489c-901a-dd72d9af0fa7', N'user_20', N'user_20@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T14:04:03.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'fd2a304b-5b9d-4006-ab92-e761e5b83c72', N'user_6', N'user_6@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T19:33:09.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'e896f497-60f8-4706-ba6c-ea05dbbe2c8e', N'John Doe', N'john.doe@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T20:01:38.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'52e253be-33d1-4b6f-ad41-ea789a1b1edb', N'Michael Brown', N'michael.brown@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T17:14:54.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'e603102c-e6f7-47f8-9083-ec330062ab54', N'Elizabeth Garcia', N'elizabeth.garcia@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T14:32:44.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'04e730c4-360a-4912-9143-efdfd35325c7', N'Matthew Scott', N'matthew.scott@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T05:20:09.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'd0521f17-568e-4d3e-8fac-f1401bcda49a', N'Susan Allen', N'susan.allen@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T12:28:45.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'4153a2da-40ed-4962-aebf-f2278c07fd8c', N'user_16', N'user_16@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T01:01:04.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'f3e440ba-a1f3-447f-91fd-f3eb6523ac82', N'Karen Hernandez', N'karen.hernandez@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T03:08:06.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'5400c558-7741-4b47-93c6-f5c23add1558', N'hoangthid', N'hoangthid@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'5400c558-7741-4b47-93c6-f5c23add1559', N'tuananh', N'tuananh@gmail.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-02-19T16:32:47.613' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'bfcd2888-a830-4483-af00-f8de363397aa', N'user_2', N'user_2@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T12:38:28.000' AS DateTime))
INSERT [dbo].[user] ([id], [user_name], [email], [password], [status], [created_at]) VALUES (N'c95a5de1-81bb-4f44-a629-fd5ae7571bb4', N'user_19', N'user_19@example.com', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 1, CAST(N'2025-03-28T19:58:08.000' AS DateTime))
GO
INSERT [dbo].[user_gender] ([id], [name]) VALUES (1, N'MALE')
INSERT [dbo].[user_gender] ([id], [name]) VALUES (2, N'FEMALE')
INSERT [dbo].[user_gender] ([id], [name]) VALUES (3, N'OTHER')
GO
SET IDENTITY_INSERT [dbo].[user_roles] ON 

INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (1, N'6fc34f42-46e4-4355-8dad-b17da99885ae', 1)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (2, N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', 2)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (3, N'dde923de-6b2a-4104-a293-6da7aaa68ef3', 2)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (4, N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (5, N'680fefa1-9463-40a3-9d48-594529ab96cf', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (6, N'5400c558-7741-4b47-93c6-f5c23add1559', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (7, N'92de3d6a-c464-48a2-86b3-04b8a789423e', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (8, N'58558870-b193-4ed9-b7f3-0e47e49a123f', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (9, N'af3de66c-188d-4c2c-a568-12d75a40d0c4', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (10, N'5ee2958e-10ad-4a1c-b92a-1b85e205a005', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (11, N'96bfce1e-92ae-4cfe-b5e7-3528eaab7780', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (12, N'd466627b-bbfc-4e18-840d-366c4d280554', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (13, N'0af3ecf0-f016-424f-96d5-4470171c3309', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (14, N'eb93af8b-fca5-47ab-88a9-44bc37e32839', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (15, N'39ec5065-ab3a-47be-94be-5062071bce22', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (16, N'ede7014a-0a7a-4da8-b8ab-558ebd728fcc', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (17, N'ad184c16-bedc-4f18-a5be-55be523de207', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (18, N'f8997bcb-ce9e-473b-aafc-5b41aa1e6cf2', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (19, N'3e3320c2-2823-45f6-be4d-5cb23ee4820f', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (20, N'2342c522-ac20-41b5-a68a-6f5aff04bf55', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (21, N'0c7eff3f-829d-48ec-b013-7215ecbbb770', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (22, N'20385105-c243-48bf-8626-7795cb91ff56', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (23, N'3a1a07a5-6d7c-49e1-a8bb-79ed2c4c05d1', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (24, N'8140a1d5-8e8c-4124-8ee1-8b70916882a0', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (25, N'2183b427-cd87-49ec-b9a0-8d6786c2d68a', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (26, N'338370fd-a839-40c0-8fbd-94724416b989', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (27, N'67d02878-3905-4e56-92ce-a8568195af84', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (28, N'd9b48f0b-162e-47a4-81d3-afbab9cea3f2', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (29, N'a5e88b90-ccf0-4c9f-be2c-b6d70ff3dd3b', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (30, N'ae43c89a-98ef-413d-a1f1-b79ae852d17d', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (31, N'e536c8be-6c17-46d9-8cbb-bfa06ff6bca2', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (32, N'c5104052-5081-477b-8b17-cc7c9865f834', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (33, N'b7ef1ef7-b6a1-4c54-ac49-d14873c97e95', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (34, N'e8b1796b-ee6c-4bb9-a540-d4b5b1fc3b7d', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (35, N'f9064543-5f37-46db-bb53-dc0acc53ceb1', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (36, N'55b49fd1-0dc3-489c-901a-dd72d9af0fa7', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (37, N'fd2a304b-5b9d-4006-ab92-e761e5b83c72', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (38, N'e896f497-60f8-4706-ba6c-ea05dbbe2c8e', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (39, N'52e253be-33d1-4b6f-ad41-ea789a1b1edb', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (40, N'e603102c-e6f7-47f8-9083-ec330062ab54', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (41, N'04e730c4-360a-4912-9143-efdfd35325c7', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (42, N'd0521f17-568e-4d3e-8fac-f1401bcda49a', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (43, N'4153a2da-40ed-4962-aebf-f2278c07fd8c', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (44, N'f3e440ba-a1f3-447f-91fd-f3eb6523ac82', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (45, N'bfcd2888-a830-4483-af00-f8de363397aa', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (46, N'c95a5de1-81bb-4f44-a629-fd5ae7571bb4', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (47, N'bf403536-6c5e-4016-b0a9-37340dfc4df9', 3)
INSERT [dbo].[user_roles] ([id], [user_id], [role_id]) VALUES (48, N'db66960d-da7b-4f1a-a055-b04d6cbcf334', 0)
SET IDENTITY_INSERT [dbo].[user_roles] OFF
GO
INSERT [dbo].[user_status] ([id], [status_name]) VALUES (1, N'ACTIVE')
INSERT [dbo].[user_status] ([id], [status_name]) VALUES (2, N'INACTIVE')
INSERT [dbo].[user_status] ([id], [status_name]) VALUES (3, N'BANNED')
GO
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'92de3d6a-c464-48a2-86b3-04b8a789423e', N'Elizabeth Wilson', N'123-456-2999', NULL, 3, CAST(N'1984-03-28' AS Date), N'Address 816', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'58558870-b193-4ed9-b7f3-0e47e49a123f', N'Michael Johnson', N'123-456-2127', NULL, 3, CAST(N'1980-03-28' AS Date), N'Address 873', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'af3de66c-188d-4c2c-a568-12d75a40d0c4', N'Jane Allen', N'123-456-1752', NULL, 3, CAST(N'1983-03-28' AS Date), N'Address 383', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'5ee2958e-10ad-4a1c-b92a-1b85e205a005', N'John Doe', N'123-456-9434', NULL, 3, CAST(N'1989-03-28' AS Date), N'Address 915', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'96bfce1e-92ae-4cfe-b5e7-3528eaab7780', N'Joseph Lee', N'123-456-6161', NULL, 3, CAST(N'1994-03-28' AS Date), N'Address 827', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'd466627b-bbfc-4e18-840d-366c4d280554', N'Patricia Hernandez', N'123-456-7518', NULL, 3, CAST(N'1987-03-28' AS Date), N'Address 96', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'0af3ecf0-f016-424f-96d5-4470171c3309', N'Nancy Hall', N'123-456-556', NULL, 3, CAST(N'1998-03-28' AS Date), N'Address 551', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'eb93af8b-fca5-47ab-88a9-44bc37e32839', N'Joseph Wilson', N'123-456-7769', NULL, 3, CAST(N'2000-03-28' AS Date), N'Address 86', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'39ec5065-ab3a-47be-94be-5062071bce22', N'Emily Johnson', N'123-456-6940', NULL, 3, CAST(N'2000-03-28' AS Date), N'Address 135', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'ede7014a-0a7a-4da8-b8ab-558ebd728fcc', N'Jane Hall', N'123-456-1275', NULL, 3, CAST(N'1999-03-28' AS Date), N'Address 896', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'ad184c16-bedc-4f18-a5be-55be523de207', N'Robert Martinez', N'123-456-9462', NULL, 3, CAST(N'1983-03-28' AS Date), N'Address 766', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'680fefa1-9463-40a3-9d48-594529ab96cf', N'Charles Hall', N'123-456-8585', NULL, 3, CAST(N'2004-03-28' AS Date), N'Address 673', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'f8997bcb-ce9e-473b-aafc-5b41aa1e6cf2', N'Michael Smith', N'123-456-5072', NULL, 3, CAST(N'2003-03-28' AS Date), N'Address 939', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'3e3320c2-2823-45f6-be4d-5cb23ee4820f', N'Barbara Brown', N'123-456-6402', NULL, 3, CAST(N'1981-03-28' AS Date), N'Address 971', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'dde923de-6b2a-4104-a293-6da7aaa68ef3', N'John Brown', N'123-456-2027', NULL, 3, CAST(N'1980-03-28' AS Date), N'Address 626', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'2342c522-ac20-41b5-a68a-6f5aff04bf55', N'Emily Martinez', N'123-456-3725', NULL, 3, CAST(N'2003-03-28' AS Date), N'Address 36', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'0c7eff3f-829d-48ec-b013-7215ecbbb770', N'John Hernandez', N'123-456-3533', NULL, 3, CAST(N'1979-03-28' AS Date), N'Address 991', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'20385105-c243-48bf-8626-7795cb91ff56', N'John Jones', N'123-456-8806', NULL, 3, CAST(N'1990-03-28' AS Date), N'Address 289', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'3a1a07a5-6d7c-49e1-a8bb-79ed2c4c05d1', N'Elizabeth Green', N'123-456-1093', NULL, 3, CAST(N'1988-03-28' AS Date), N'Address 139', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'8140a1d5-8e8c-4124-8ee1-8b70916882a0', N'Michael King', N'123-456-9213', NULL, 3, CAST(N'1977-03-28' AS Date), N'Address 44', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'2183b427-cd87-49ec-b9a0-8d6786c2d68a', N'Elizabeth Rodriguez', N'123-456-617', NULL, 3, CAST(N'2001-03-28' AS Date), N'Address 187', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'338370fd-a839-40c0-8fbd-94724416b989', N'Patricia Walker', N'123-456-9890', NULL, 3, CAST(N'1997-03-28' AS Date), N'Address 115', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'042d839d-8c72-49ba-8d6b-95b1d5a026a9', N'Charles Lee', N'123-456-2199', NULL, 3, CAST(N'1978-03-28' AS Date), N'Address 15', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'1d809d9a-4780-48b4-8d2e-a1f3aad9faf6', N'Susan Jones', N'123-456-5781', NULL, 3, CAST(N'1988-03-28' AS Date), N'Address 591', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'67d02878-3905-4e56-92ce-a8568195af84', N'Elizabeth Smith', N'123-456-1719', NULL, 3, CAST(N'2001-03-28' AS Date), N'Address 555', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'd9b48f0b-162e-47a4-81d3-afbab9cea3f2', N'Nancy Doe', N'123-456-5032', NULL, 3, CAST(N'1986-03-28' AS Date), N'Address 257', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'6fc34f42-46e4-4355-8dad-b17da99885ae', N'Linda Walker', N'123-456-3125', NULL, 3, CAST(N'1990-03-28' AS Date), N'Address 987', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'a5e88b90-ccf0-4c9f-be2c-b6d70ff3dd3b', N'Patricia Green', N'123-456-4303', NULL, 3, CAST(N'2004-03-28' AS Date), N'Address 508', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'ae43c89a-98ef-413d-a1f1-b79ae852d17d', N'Jane Young', N'123-456-3754', NULL, 3, CAST(N'1988-03-28' AS Date), N'Address 115', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'e536c8be-6c17-46d9-8cbb-bfa06ff6bca2', N'Joseph Wright', N'123-456-369', NULL, 3, CAST(N'2000-03-28' AS Date), N'Address 490', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'c5104052-5081-477b-8b17-cc7c9865f834', N'William Young', N'123-456-7580', NULL, 3, CAST(N'1984-03-28' AS Date), N'Address 409', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'b7ef1ef7-b6a1-4c54-ac49-d14873c97e95', N'Christopher Martinez', N'123-456-6854', NULL, 3, CAST(N'2003-03-28' AS Date), N'Address 947', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'e8b1796b-ee6c-4bb9-a540-d4b5b1fc3b7d', N'Christopher Rodriguez', N'123-456-9237', NULL, 3, CAST(N'1993-03-28' AS Date), N'Address 129', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'f9064543-5f37-46db-bb53-dc0acc53ceb1', N'Sarah Walker', N'123-456-7257', NULL, 3, CAST(N'1998-03-28' AS Date), N'Address 829', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'55b49fd1-0dc3-489c-901a-dd72d9af0fa7', N'Charles Wright', N'123-456-7553', NULL, 3, CAST(N'1996-03-28' AS Date), N'Address 875', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'fd2a304b-5b9d-4006-ab92-e761e5b83c72', N'Elizabeth Walker', N'123-456-1308', NULL, 3, CAST(N'1993-03-28' AS Date), N'Address 79', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'e896f497-60f8-4706-ba6c-ea05dbbe2c8e', N'John Walker', N'123-456-5868', NULL, 3, CAST(N'1981-03-28' AS Date), N'Address 503', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'52e253be-33d1-4b6f-ad41-ea789a1b1edb', N'Emily Smith', N'123-456-9022', NULL, 3, CAST(N'1988-03-28' AS Date), N'Address 573', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'e603102c-e6f7-47f8-9083-ec330062ab54', N'Emily Walker', N'123-456-7443', NULL, 3, CAST(N'1991-03-28' AS Date), N'Address 32', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'04e730c4-360a-4912-9143-efdfd35325c7', N'Christopher Johnson', N'123-456-8131', NULL, 3, CAST(N'1991-03-28' AS Date), N'Address 447', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'd0521f17-568e-4d3e-8fac-f1401bcda49a', N'William Rodriguez', N'123-456-7686', NULL, 3, CAST(N'1981-03-28' AS Date), N'Address 450', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'4153a2da-40ed-4962-aebf-f2278c07fd8c', N'Christopher Jones', N'123-456-6781', NULL, 3, CAST(N'1981-03-28' AS Date), N'Address 37', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'f3e440ba-a1f3-447f-91fd-f3eb6523ac82', N'Emily Hall', N'123-456-8117', NULL, 3, CAST(N'1982-03-28' AS Date), N'Address 919', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'5400c558-7741-4b47-93c6-f5c23add1558', N'Sarah Green', N'123-456-1095', NULL, 3, CAST(N'1993-03-28' AS Date), N'Address 678', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'5400c558-7741-4b47-93c6-f5c23add1559', N'Charles Smith', N'123-456-9311', NULL, 3, CAST(N'2002-03-28' AS Date), N'Address 43', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'bfcd2888-a830-4483-af00-f8de363397aa', N'Karen Green', N'123-456-9799', NULL, 3, CAST(N'1994-03-28' AS Date), N'Address 420', NULL)
INSERT [dbo].[userinfo] ([id], [full_name], [phone_number], [avatar_url], [gender], [date_of_birth], [address], [update_at]) VALUES (N'c95a5de1-81bb-4f44-a629-fd5ae7571bb4', N'William Lee', N'123-456-2316', NULL, 3, CAST(N'1997-03-28' AS Date), N'Address 721', NULL)
GO
SET IDENTITY_INSERT [dbo].[voucher] ON 

INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (2, N'DISCOUNT10', 1, CAST(10.00 AS Decimal(10, 2)), N'Giảm giá 10% cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 1, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (3, N'DISCOUNT20', 1, CAST(20.00 AS Decimal(10, 2)), N'Giảm giá 20% cho đơn hàng', CAST(N'2024-09-01T00:00:00.000' AS DateTime), CAST(N'2024-09-30T00:00:00.000' AS DateTime), 2, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (4, N'DISCOUNT30', 1, CAST(30.00 AS Decimal(10, 2)), N'Giảm giá 30% cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 3, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 10)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (5, N'DISCOUNT40', 1, CAST(40.00 AS Decimal(10, 2)), N'Giảm giá 40% cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 4, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (6, N'DISCOUNT50', 1, CAST(50.00 AS Decimal(10, 2)), N'Giảm giá 50% cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 5, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (7, N'AMOUNT10', 2, CAST(10000.00 AS Decimal(10, 2)), N'Giảm giá 10.000đ cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 1, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (8, N'AMOUNT20', 2, CAST(20000.00 AS Decimal(10, 2)), N'Giảm giá 20.000đ cho đơn hàng', CAST(N'2024-09-01T00:00:00.000' AS DateTime), CAST(N'2024-09-30T00:00:00.000' AS DateTime), 2, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (9, N'AMOUNT30', 2, CAST(30000.00 AS Decimal(10, 2)), N'Giảm giá 30.000đ cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 3, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 10)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (10, N'AMOUNT40', 2, CAST(40000.00 AS Decimal(10, 2)), N'Giảm giá 40.000đ cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 4, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (11, N'AMOUNT50', 2, CAST(50000.00 AS Decimal(10, 2)), N'Giảm giá 50.000đ cho đơn hàng', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 5, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (12, N'FREESHIP1', 3, CAST(0.00 AS Decimal(10, 2)), N'Miễn phí vận chuyển', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 1, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (13, N'FREESHIP2', 3, CAST(0.00 AS Decimal(10, 2)), N'Miễn phí vận chuyển', CAST(N'2024-09-01T00:00:00.000' AS DateTime), CAST(N'2024-09-30T00:00:00.000' AS DateTime), 2, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (14, N'FREESHIP3', 3, CAST(0.00 AS Decimal(10, 2)), N'Miễn phí vận chuyển', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 3, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 10)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (15, N'FREESHIP4', 3, CAST(0.00 AS Decimal(10, 2)), N'Miễn phí vận chuyển', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 4, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
INSERT [dbo].[voucher] ([id], [code], [type], [value], [description], [start_date], [end_date], [status], [create_at], [update_at], [usage_limit], [usage_count]) VALUES (16, N'FREESHIP5', 3, CAST(0.00 AS Decimal(10, 2)), N'Miễn phí vận chuyển', CAST(N'2025-03-01T00:00:00.000' AS DateTime), CAST(N'2025-03-31T00:00:00.000' AS DateTime), 5, CAST(N'2025-03-20T21:38:45.450' AS DateTime), CAST(N'2025-03-20T21:38:45.450' AS DateTime), 10, 0)
SET IDENTITY_INSERT [dbo].[voucher] OFF
GO
INSERT [dbo].[voucher_status] ([id], [name]) VALUES (1, N'ACTIVE')
INSERT [dbo].[voucher_status] ([id], [name]) VALUES (2, N'EXPIRED')
INSERT [dbo].[voucher_status] ([id], [name]) VALUES (3, N'USED')
INSERT [dbo].[voucher_status] ([id], [name]) VALUES (4, N'DISABLED')
INSERT [dbo].[voucher_status] ([id], [name]) VALUES (5, N'PENDING')
GO
INSERT [dbo].[voucher_type] ([id], [name]) VALUES (1, N'DISCOUNT PERCENTAGE')
INSERT [dbo].[voucher_type] ([id], [name]) VALUES (2, N'DISCOUNT AMOUNT')
INSERT [dbo].[voucher_type] ([id], [name]) VALUES (3, N'FREE SHIPPING')
GO
SET IDENTITY_INSERT [dbo].[VoucherUsage] ON 

INSERT [dbo].[VoucherUsage] ([id], [user_id], [voucher_id], [used_at]) VALUES (1, N'680fefa1-9463-40a3-9d48-594529ab96cf', 2, CAST(N'2025-03-20T21:44:43.267' AS DateTime))
INSERT [dbo].[VoucherUsage] ([id], [user_id], [voucher_id], [used_at]) VALUES (2, N'af3de66c-188d-4c2c-a568-12d75a40d0c4', 2, CAST(N'2025-03-28T23:05:11.173' AS DateTime))
SET IDENTITY_INSERT [dbo].[VoucherUsage] OFF
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT ((0)) FOR [total_amount]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[cart_detail] ADD  DEFAULT ((0)) FOR [quantity]
GO
ALTER TABLE [dbo].[cart_detail] ADD  DEFAULT ((0)) FOR [total_price]
GO
ALTER TABLE [dbo].[cart_detail] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[cart_detail] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[order] ADD  DEFAULT (NULL) FOR [full_name]
GO
ALTER TABLE [dbo].[order] ADD  DEFAULT (NULL) FOR [phone_number]
GO
ALTER TABLE [dbo].[order] ADD  DEFAULT ('#') FOR [payment_link]
GO
ALTER TABLE [dbo].[productRejectionLog] ADD  DEFAULT (getdate()) FOR [rejected_at]
GO
ALTER TABLE [dbo].[productRejectionLog] ADD  DEFAULT ((0)) FOR [resend_count]
GO
ALTER TABLE [dbo].[roles] ADD  DEFAULT (NULL) FOR [name]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT (NULL) FOR [user_name]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT (NULL) FOR [password]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT (NULL) FOR [status]
GO
ALTER TABLE [dbo].[user] ADD  DEFAULT (NULL) FOR [created_at]
GO
ALTER TABLE [dbo].[user_gender] ADD  DEFAULT (NULL) FOR [name]
GO
ALTER TABLE [dbo].[user_roles] ADD  DEFAULT (NULL) FOR [user_id]
GO
ALTER TABLE [dbo].[user_roles] ADD  DEFAULT (NULL) FOR [role_id]
GO
ALTER TABLE [dbo].[user_status] ADD  DEFAULT (NULL) FOR [status_name]
GO
ALTER TABLE [dbo].[userinfo] ADD  DEFAULT (NULL) FOR [full_name]
GO
ALTER TABLE [dbo].[userinfo] ADD  DEFAULT (NULL) FOR [phone_number]
GO
ALTER TABLE [dbo].[userinfo] ADD  DEFAULT (NULL) FOR [avatar_url]
GO
ALTER TABLE [dbo].[userinfo] ADD  DEFAULT (NULL) FOR [gender]
GO
ALTER TABLE [dbo].[userinfo] ADD  DEFAULT (NULL) FOR [date_of_birth]
GO
ALTER TABLE [dbo].[VoucherUsage] ADD  DEFAULT (getdate()) FOR [used_at]
GO
ALTER TABLE [dbo].[cart]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD FOREIGN KEY([cart_id])
REFERENCES [dbo].[cart] ([id])
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[order] ([id])
GO
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[image]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD FOREIGN KEY([customer_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[order_status] ([id])
GO
ALTER TABLE [dbo].[order]  WITH CHECK ADD FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[order] ([id])
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[order_details]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[orderdetail_status] ([id])
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([id])
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD FOREIGN KEY([seller_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[product]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[product_status] ([id])
GO
ALTER TABLE [dbo].[product_variants]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[productRejectionLog]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[report]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[report]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[report_status] ([id])
GO
ALTER TABLE [dbo].[report]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[user]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[user_status] ([id])
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
GO
ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[userinfo]  WITH CHECK ADD FOREIGN KEY([gender])
REFERENCES [dbo].[user_gender] ([id])
GO
ALTER TABLE [dbo].[userinfo]  WITH CHECK ADD FOREIGN KEY([id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD FOREIGN KEY([status])
REFERENCES [dbo].[voucher_status] ([id])
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD FOREIGN KEY([type])
REFERENCES [dbo].[voucher_type] ([id])
GO
ALTER TABLE [dbo].[VoucherUsage]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
ALTER TABLE [dbo].[VoucherUsage]  WITH CHECK ADD FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[wishlist]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[product] ([id])
GO
ALTER TABLE [dbo].[wishlist]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[user] ([id])
GO
USE [master]
GO
ALTER DATABASE [ClothingShop_PRN232_G5] SET  READ_WRITE 
GO
