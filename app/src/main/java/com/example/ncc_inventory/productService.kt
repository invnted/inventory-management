package com.example.ncc_inventory

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface ProductService {

    @POST("https://d24b-2409-4085-8cc8-9517-8ec-f714-4a0e-e522.ngrok-free.app/products/add") // Replace with your actual endpoint for adding products
    fun addProduct(@Body product: Product): Call<ProductResponse> // Replace with your response type
}