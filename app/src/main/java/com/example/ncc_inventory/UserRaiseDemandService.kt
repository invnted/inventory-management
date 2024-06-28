package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface UserRaiseDemandService {
    @POST("https://aa94-2409-4085-8703-90df-21ed-5c4-8bba-22ed.ngrok-free.app/products/makeDemand")
    fun raiseDemand(@Body demand: demand): Call<userRaiseDemandResponse>
}