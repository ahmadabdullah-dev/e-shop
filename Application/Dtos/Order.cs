using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class ProductOrderItemDto
{
    [Required]
    public required string ProductId { get; set; }

    [Range(1, 1000)]
    public int Quantity { get; set; }
}

public class CreateOrderDto
{
    [Required, StringLength(500)]
    public required string ShippingAddress { get; set; }

    [Required, MinLength(1), MaxLength(200)]
    public required List<ProductOrderItemDto> Products { get; set; }
}
public class OrderDto
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
    public required string ShippingAddress { get; set; }
    public required List<ProductOrderItemDto> Products { get; set; }
    public required decimal TotalPrice { get; set; }
    public string OrderStatus { get; set; } = null!;
    public required DateTime CreatedAt { get; set; }
}