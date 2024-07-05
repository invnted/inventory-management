package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface managerService {
    @POST("https://d24b-2409-4085-8cc8-9517-8ec-f714-4a0e-e522.ngrok-free.app/managers/manager-register") // Replace with your actual endpoint for adding products
    fun addManager(@Body manager: Manager): Call<ManagerResponse>
}