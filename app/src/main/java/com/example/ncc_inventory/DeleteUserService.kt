package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface DeleteUserService {
    @POST("https://0842-2409-4085-9d0d-d35c-78e8-38e6-9a5e-539d.ngrok-free.app/users/user-delete")
    fun deleteUser(@Body deleteUser: deleteUser): Call<EditUserResponse>
}