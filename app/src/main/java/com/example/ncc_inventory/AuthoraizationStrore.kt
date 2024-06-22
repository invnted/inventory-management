package com.example.ncc_inventory

import android.graphics.Color
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import ir.mahozad.android.PieChart
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.create

class AuthoraizationStrore : AppCompatActivity() {
    private lateinit var spinner : Spinner
    private lateinit var getDetailsBtn : TextView
    private lateinit var myAdapter: ArrayAdapter<String>
    private var items = mutableListOf("mk","Desktop","Mouse","Keyboard","Add Item")
    private lateinit var rtfit : Retrofit
    private lateinit var myproductList : MutableList<String>
    private lateinit var click : Animation
    private lateinit var myItem : String
    private  var  totalProducts : Int  = 0
    private var HELD = 0
    private var ISSUED = 0
    private var SERVICEABLE = 0
    private var UNSERVICEABLE = 0
    private var BER = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_authoraization_strore)

        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        rtfit = rFit.retrofit!!
        myItem = ""
       myproductList = mutableListOf()
       val productListService  = rtfit.create(ProductListService::class.java)
        productListService.getProductList().enqueue(object : Callback<List<String>>{
            override fun onResponse(call: Call<List<String>>, response: Response<List<String>>) {
                if(response.isSuccessful){
                    myproductList = response.body() as MutableList<String>
                    if(myproductList != null) {
                        Toast.makeText(this@AuthoraizationStrore,"Loading...",Toast.LENGTH_SHORT).show()
                        setSpinner()
                    }
                    else{
                        Toast.makeText(this@AuthoraizationStrore,"Some error Occured",Toast.LENGTH_SHORT).show()
                    }
                }

            }

            override fun onFailure(call: Call<List<String>>, t: Throwable) {
                Toast.makeText(this@AuthoraizationStrore,"Response Failed",Toast.LENGTH_SHORT).show()
            }
        })


        click = AnimationUtils.loadAnimation(this,R.anim.click)
        getDetailsBtn = findViewById(R.id.getDetails)
        getDetailsBtn.setOnClickListener {
            getDetailsBtn.startAnimation(click)
            sendAndReceiveData()
        }

        val pieChart = findViewById<PieChart>(R.id.pieChart)
        pieChart.slices = listOf(
            PieChart.Slice(0.2f, Color.BLUE),
            PieChart.Slice(0.4f, Color.MAGENTA),
            PieChart.Slice(0.3f, Color.GREEN),
            PieChart.Slice(0.1f, Color.CYAN)
        )

    }

    private fun sendAndReceiveData() {
        val storeService = rtfit.create(StoreService::class.java)
        val productTypeResponse = productTypeResponse(myItem)
        storeService.getData(productTypeResponse).enqueue(object : Callback<storeResponse>{
            override fun onResponse(call: Call<storeResponse>, response: Response<storeResponse>) {
                if(response.isSuccessful){
                   val respo = response.body()
                    if(respo?.success == true){
                        totalProducts = respo.totalProducts
                        HELD = respo.HELD
                        ISSUED = respo.ISSUED
                        SERVICEABLE = respo.SERVICEABLE
                        UNSERVICEABLE = respo.UNSERVICEABLE
                        BER = respo.BER
                        Toast.makeText(this@AuthoraizationStrore,BER.toString(),Toast.LENGTH_SHORT).show()
                    }
                }else{
                    Toast.makeText(this@AuthoraizationStrore,"2",Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<storeResponse>, t: Throwable) {
                Toast.makeText(this@AuthoraizationStrore," response Failed",Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun setSpinner(){

        if(myproductList!= null){
            items = mutableListOf()
            for(i in myproductList.indices){
                items.add(myproductList[i])
            }
        }
        spinner = findViewById(R.id.authItem)
        myAdapter = ArrayAdapter(this,android.R.layout.simple_spinner_item,items)
        myAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = myAdapter
        spinner.setOnItemSelectedListener(object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
             myItem = parent.getItemAtPosition(position).toString()
            }
            override fun onNothingSelected(parent: AdapterView<*>) {}
        })
    }
}