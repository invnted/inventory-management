package com.example.ncc_inventory

data class storeResponse(val success: Boolean, val message: String, val totalProducts : Int ,val HELD : Int , val ISSUED : Int , val SERVICEABLE : Int , val UNSERVICEABLE : Int , val BER : Int)