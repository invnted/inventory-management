package com.example.ncc_inventory

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface ProductService {

    @POST("https://6f44-2409-4085-8703-90df-bce8-d246-3355-1258.ngrok-free.app/products/add") // Replace with your actual endpoint for adding products
    fun addProduct(@Body product: Product): Call<ProductResponse> // Replace with your response type
}