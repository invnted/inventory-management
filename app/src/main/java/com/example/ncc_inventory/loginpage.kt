package com.example.ncc_inventory

import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create
import retrofit2.http.Body
import retrofit2.http.POST
object rFit{
  var retrofit : Retrofit? = null
  const val BASE_URL_PLACEHOLDER = "https://3bfa-103-37-80-91.ngrok-free.app/"
}
data class managerloginrequest(
    val managerId : String,val  password : String
)
class loginpage : AppCompatActivity() {
    private lateinit var check : String
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_loginpage)

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT)
        {
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        val loginButton = findViewById<TextView>(R.id.login_button)
        check = intent.getStringExtra("check")!!
        //loading click animation
        val click = AnimationUtils.loadAnimation(this,R.anim.click)

        loginButton.setOnClickListener {
            loginButton.startAnimation(click)
            val email = findViewById<EditText>(R.id.email).text.toString()
            val password = findViewById<EditText>(R.id.password).text.toString()
            val baseUrl = rFit.BASE_URL_PLACEHOLDER
            loginUser(email, password, baseUrl)
        }
    }
    private fun loginUser(email: String, password: String, baseUrl: String) {
        // Retrofit setup (explained later)
        val retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
         rFit.retrofit = retrofit
        if (check == "100") {
            val loginService = retrofit.create(LoginService::class.java)
            val loginRequest = LoginRequest(email, password)
            loginService.login(loginRequest)
                .enqueue(object : Callback<LoginResponse> {
                    override fun onResponse(
                        call: Call<LoginResponse>,
                        response: Response<LoginResponse>
                    ) {
                        if (response.isSuccessful) {
                            val loginResponse = response.body()
                            if (loginResponse != null) {
                                // Handle successful login

                                val user = loginResponse.admin
                                Toast.makeText(
                                    this@loginpage,
                                    "Login successful!",
                                    Toast.LENGTH_SHORT
                                ).show()
                                if (user != null) {
                                    // Access user details
                                    val username = user.adminName
                                    val userEmail = user.email
                                    val role = user.role
                                    val id = user.profileId
                                    val department = user.department
                                    when (role) {
                                        "superadmin" -> {
                                            val it = Intent(this@loginpage, Dashboard::class.java)
                                            it.putExtra("userName", username)
                                            it.putExtra("userEmail", userEmail)
                                            it.putExtra("role", role)
                                            it.putExtra("id", id)
                                            it.putExtra("department", department)
                                            startActivity(it)
                                            finish()
                                        }
                                        else -> {
                                            Toast.makeText(
                                                this@loginpage,
                                                "Role not defined",
                                                Toast.LENGTH_SHORT
                                            ).show()
                                        }
                                    }

                                }
                            } else {
                                Toast.makeText(
                                    this@loginpage,
                                    loginResponse?.message ?: "Login failed12",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        } else {
                            // Handle login failure (e.g., display error message)
                            Toast.makeText(
                                this@loginpage,
                                "Login failed1221: ${response.code()}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }

                    override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                        // Handle network errors
                        Toast.makeText(
                            this@loginpage,
                            "Login failed m: ${t.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                })
        }
        else if(check == "010"){
           val managerloginrequest = managerloginrequest(email,password)
           val managerLoginService = retrofit.create(managerLoginService::class.java)
           managerLoginService.managerLogin(managerloginrequest).enqueue(object :Callback<managerLoginResponse>{
               override fun onResponse(
                   call: Call<managerLoginResponse>,
                   response: Response<managerLoginResponse>
               ) {
                   if(response.isSuccessful){
                       val respo = response.body()
                       if(respo?.success==true){
                           val it = Intent(this@loginpage, managerDashboard::class.java)
                           it.putExtra("name",respo.managerData.managerName)
                           it.putExtra("id",respo.managerData.managerId)
                           it.putExtra("pass",respo.managerData.password)
                           it.putExtra("desig",respo.managerData.designation)
                           it.putExtra("appt",respo.managerData.appointment)
                           it.putExtra("section",respo.managerData.section)
                           it.putExtra("allreport",respo.managerData.allProductReport)
                           it.putExtra("issue",respo.managerData.issueProduct)
                           it.putExtra("demand",respo.managerData.demandReceived)
                           startActivity(it)
                       }
                   }else
                   {
                       Toast.makeText(this@loginpage,"Invalid Credentials",Toast.LENGTH_SHORT).show()
                   }
               }
               override fun onFailure(call: Call<managerLoginResponse>, t: Throwable) {
                   Toast.makeText(this@loginpage,"Response failed",Toast.LENGTH_SHORT).show()

               }
           })

        }
        else if(check == "001"){
          val loginUserService = retrofit.create(LoginUserService::class.java)
          val loginUserRequest = loginUserRequest(email,password)
          loginUserService.loginUser(loginUserRequest).enqueue(object : Callback<loginUserResponse>{
              override fun onResponse(
                  call: Call<loginUserResponse>,
                  response: Response<loginUserResponse>
              ) {
                  if(response.isSuccessful){
                      val respo = response.body()
                      if(respo?.success==true){
                          val user = respo.user
                          if(user!=null){
                              val it = Intent(this@loginpage, userDashboard::class.java)
                              it.putExtra("userName", user.userName)
                              it.putExtra("userEmail", user.userId)
                              it.putExtra("designation", user.designation)
                              it.putExtra("section", user.section)
                              it.putExtra("appointment", user.appointment)
                              startActivity(it)
                              finish()
                          }
                          Toast.makeText(this@loginpage,"Login Successful",Toast.LENGTH_SHORT).show()
                      }else{
                          Toast.makeText(this@loginpage,"Invalid Credentials",Toast.LENGTH_SHORT).show()
                      }
                  }else{
                      Toast.makeText(this@loginpage,"Invalid Credentials",Toast.LENGTH_SHORT).show()
                  }
              }

              override fun onFailure(call: Call<loginUserResponse>, t: Throwable) {
                  Toast.makeText(this@loginpage,"Response Failed",Toast.LENGTH_SHORT).show()
              }
          })
        }
    }
}