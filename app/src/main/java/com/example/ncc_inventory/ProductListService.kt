package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface ProductListService {
    @POST("https://6f44-2409-4085-8703-90df-bce8-d246-3355-1258.ngrok-free.app/products/productType-list")
    fun getProductList():Call<List<String>>
}