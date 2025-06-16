﻿using ClothingShop_BE.Models;

namespace ClothingShop_BE.ModelsDTO
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public CategoryDTO() { }

        public CategoryDTO(Category category)
        {
            Id = category.Id;
            Name = category.Name;
        }

        public Category ToCategory()
        {
            return new Category
            {
                Id = this.Id,
                Name = this.Name
            };
        }
    }
}
