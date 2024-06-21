package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface DeleteManagerService {
    @POST("https://28c4-2409-4085-8818-b6b0-257c-9b25-3fe5-643c.ngrok-free.app/managers/manager-delete")
    fun deleteManager(@Body deleteManager: deleteManager) : Call<ManagerResponse>
}