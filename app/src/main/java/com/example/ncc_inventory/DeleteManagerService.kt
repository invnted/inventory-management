package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface DeleteManagerService {
    @POST("https://d8de-2409-4085-8698-9796-a414-f656-175c-b897.ngrok-free.app/managers/manager-delete")
    fun deleteManager(@Body deleteManager: deleteManager) : Call<ManagerResponse>
}