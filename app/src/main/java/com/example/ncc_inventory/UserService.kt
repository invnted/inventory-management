package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface UserService {
    @POST("https://6566-2409-4085-868f-3228-a4da-f4d4-f0b9-c9f5.ngrok-free.app/users/user-register")
    fun addnewUser(@Body user : User): Call<UserResponse>
}