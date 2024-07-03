package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface ProductListService {
    @POST("https://05d0-2409-4085-8703-90df-50bd-ab21-81a7-d0d7.ngrok-free.app/products/productType-list")
    fun getProductList():Call<List<String>>
}