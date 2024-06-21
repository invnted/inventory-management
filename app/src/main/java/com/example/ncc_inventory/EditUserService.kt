package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface EditUserService {
    @POST("https://28c4-2409-4085-8818-b6b0-257c-9b25-3fe5-643c.ngrok-free.app/users/user-update")
    fun editUser(@Body editedUser: EditedUser) : Call<EditUserResponse>
}