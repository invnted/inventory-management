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
import retrofit2.http.Body
import retrofit2.http.POST
object rFit{
  var retrofit : Retrofit? = null
}
class loginpage : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_loginpage)

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT)
        {
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        val loginButton = findViewById<TextView>(R.id.login_button)

        //loading click animation
        val click = AnimationUtils.loadAnimation(this,R.anim.click)

        loginButton.setOnClickListener {
            loginButton.startAnimation(click)
            val email = findViewById<EditText>(R.id.email).text.toString()
            val password = findViewById<EditText>(R.id.password).text.toString()
            val baseUrl = "http://localhost:5000"
            loginUser(email, password, baseUrl)
        }
    }


    private fun loginUser(email: String, password: String, baseUrl: String) {
        // Retrofit setup (explained later)
        val retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val loginService = retrofit.create(LoginService::class.java)
        val loginRequest = LoginRequest(email, password)
        rFit.retrofit = retrofit
        loginService.login(loginRequest)
            .enqueue(object : Callback<LoginResponse> {
                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                    if (response.isSuccessful) {
                        val loginResponse = response.body()
                        if (loginResponse != null) {
                            // Handle successful login

                            val user = loginResponse.admin
                            Toast.makeText(this@loginpage, "Login successful!", Toast.LENGTH_SHORT).show()
                            if (user != null) {
                                // Access user details
                                val username = user.adminName
                                val userEmail = user.email
                                val role = user.role
                                val id = user.profileId
                                val department = user.department
                                when (role) {
                                    "superadmin" -> {
                                        val it = Intent(this@loginpage,Dashboard::class.java)
                                        it.putExtra("userName",username)
                                        it.putExtra("userEmail",userEmail)
                                        it.putExtra("role",role)
                                        it.putExtra("id",id)
                                        it.putExtra("department",department)
                                        startActivity(it)
                                        finish()
                                    }
                                    "manager" -> {
                                        //manager activity open
                                    }
                                    "user" -> {
                                        //user activity open
                                    }
                                    else -> {
                                        Toast.makeText(this@loginpage,"Role not defined",Toast.LENGTH_SHORT).show()
                                    }
                                }

                            }
                        } else {
                            Toast.makeText(this@loginpage, loginResponse?.message ?: "Login failed12", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        // Handle login failure (e.g., display error message)
                        Toast.makeText(this@loginpage, "Login failed1221: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    // Handle network errors
                    Toast.makeText(this@loginpage, "Login failed m: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}