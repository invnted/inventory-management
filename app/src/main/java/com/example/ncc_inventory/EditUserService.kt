package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface EditUserService {
    @POST("https://d8de-2409-4085-8698-9796-a414-f656-175c-b897.ngrok-free.app/users/user-update")
    fun editUser(@Body editedUser: EditedUser) : Call<EditUserResponse>
}