package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface managerLoginService {
    @POST("https://00e2-49-42-34-141.ngrok-free.app/managers/manager-login")
    fun managerLogin(@Body managerloginrequest: managerloginrequest) : Call<managerLoginResponse>
}