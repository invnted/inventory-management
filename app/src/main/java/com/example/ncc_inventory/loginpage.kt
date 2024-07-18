package com.example.ncc_inventory

import android.content.Intent
import android.graphics.Rect
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
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

object rFit {
    var retrofit: Retrofit? = null
    const val BASE_URL_PLACEHOLDER = "https://8091-103-37-80-91.ngrok-free.app/"
}

data class managerloginrequest(
    val managerId: String, val password: String
)

class loginpage : AppCompatActivity() {
    private lateinit var spinner: Spinner
    private lateinit var adapter: ArrayAdapter<String>
    private val items = mutableListOf("Select one", "Admin", "Manager", "Moderator", "User")
    private lateinit var identity: String
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_loginpage)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            )
        }

        val rootView = findViewById<View>(R.id.root_layout)

        rootView.viewTreeObserver.addOnGlobalLayoutListener {
            val r = Rect()
            rootView.getWindowVisibleDisplayFrame(r)
            val screenHeight = rootView.height
            val keypadHeight = screenHeight - r.bottom
            if (keypadHeight > screenHeight * 0.15) {
                // Keyboard is opened
                rootView.post {
                    rootView.translationY = -keypadHeight.toFloat() / 2
                }
            } else {
                // Keyboard is closed
                rootView.post {
                    rootView.translationY = 0f
                }
            }
        }


        val loginButton = findViewById<TextView>(R.id.login_button)
        //loading click animation
        val click = AnimationUtils.loadAnimation(this, R.anim.click)

        loginButton.setOnClickListener {
            loginButton.startAnimation(click)
            val email = findViewById<EditText>(R.id.email).text.toString()
            val password = findViewById<EditText>(R.id.password).text.toString()
            val baseUrl = rFit.BASE_URL_PLACEHOLDER
            loginUser(email, password, baseUrl)
        }
        identity = ""

        //Spinner for product type field in ADD category section
        spinner = findViewById(R.id.loginSpinner)
        adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, items)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
        spinner.setOnItemSelectedListener(object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>,
                view: View,
                position: Int,
                id: Long
            ) {
                if (position == 0) {
                    identity = ""
                } else {
                    identity = parent.getItemAtPosition(position).toString()
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        })

    }

    private fun loginUser(email: String, password: String, baseUrl: String) {
        // Retrofit setup (explained later)
        val retrofit = Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        rFit.retrofit = retrofit
        if (identity == "Admin") {
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
                                    val it = Intent(this@loginpage, Dashboard::class.java)
                                    it.putExtra("userName", user.adminName)
                                    it.putExtra("userEmail", user.email)
                                    it.putExtra("role", user.role)
                                    it.putExtra("id", user.profileId)
                                    it.putExtra("department", user.department)
                                    startActivity(it)
                                    finish()
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
        } else if (identity == "Manager") {
            val managerloginrequest = managerloginrequest(email, password)
            val managerLoginService = retrofit.create(managerLoginService::class.java)
            managerLoginService.managerLogin(managerloginrequest)
                .enqueue(object : Callback<managerLoginResponse> {
                    override fun onResponse(
                        call: Call<managerLoginResponse>,
                        response: Response<managerLoginResponse>
                    ) {
                        if (response.isSuccessful) {
                            val respo = response.body()
                            if (respo?.success == true) {
                                val it = Intent(this@loginpage, managerDashboard::class.java)
                                it.putExtra("name", respo.managerData.managerName)
                                it.putExtra("id", respo.managerData.managerId)
                                it.putExtra("pass", respo.managerData.password)
                                it.putExtra("desig", respo.managerData.designation)
                                it.putExtra("appt", respo.managerData.appointment)
                                it.putExtra("section", respo.managerData.section)
                                it.putExtra("allreport", respo.managerData.allProductReport)
                                it.putExtra("issue", respo.managerData.issueProduct)
                                it.putExtra("demand", respo.managerData.demandReceived)
                                startActivity(it)
                            }
                        } else {
                            Toast.makeText(
                                this@loginpage,
                                "Invalid Credentials",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }

                    override fun onFailure(call: Call<managerLoginResponse>, t: Throwable) {
                        Toast.makeText(this@loginpage, "Response failed", Toast.LENGTH_SHORT).show()

                    }
                })

        } else if (identity == "User") {
            val loginUserService = retrofit.create(LoginUserService::class.java)
            val loginUserRequest = loginUserRequest(email, password)
            loginUserService.loginUser(loginUserRequest)
                .enqueue(object : Callback<loginUserResponse> {
                    override fun onResponse(
                        call: Call<loginUserResponse>,
                        response: Response<loginUserResponse>
                    ) {
                        if (response.isSuccessful) {
                            val respo = response.body()
                            if (respo?.success == true) {
                                val user = respo.user
                                if (user != null) {
                                    val it = Intent(this@loginpage, userDashboard::class.java)
                                    it.putExtra("userName", user.userName)
                                    it.putExtra("userEmail", user.userId)
                                    it.putExtra("designation", user.designation)
                                    it.putExtra("section", user.section)
                                    it.putExtra("appointment", user.appointment)
                                    startActivity(it)
                                    finish()
                                }
                                Toast.makeText(
                                    this@loginpage,
                                    "Login Successful",
                                    Toast.LENGTH_SHORT
                                ).show()
                            } else {
                                Toast.makeText(
                                    this@loginpage,
                                    "Invalid Credentials",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        } else {
                            Toast.makeText(
                                this@loginpage,
                                "Invalid Credentials",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }

                    override fun onFailure(call: Call<loginUserResponse>, t: Throwable) {
                        Toast.makeText(this@loginpage, "Response Failed", Toast.LENGTH_SHORT).show()
                    }
                })
        } else if (identity == "Moderator") {
            val moderatorRequest = moderatorRequest(email, password)
            val service = retrofit.create(ModeratorLoginService::class.java)
            service.login(moderatorRequest).enqueue(object : Callback<moderatorResponse> {
                override fun onResponse(
                    call: Call<moderatorResponse>,
                    response: Response<moderatorResponse>
                ) {
                    if (response.isSuccessful) {
                        val respo = response.body()
                        if (respo?.success == true) {
                            val moderator = respo.moderator
                            if (moderator != null) {
                                val it = Intent(this@loginpage, moderatorDashboard::class.java)
                                it.putExtra("moderatorName", moderator.moderatorName)
                                it.putExtra("moderatorId", moderator.moderatorId)
                                it.putExtra("designation", moderator.designation)
                                it.putExtra("section", moderator.section)
                                it.putExtra("appointment", moderator.appointment)
                                startActivity(it)
                                finish()
                            }
                            Toast.makeText(this@loginpage, "Login Successful", Toast.LENGTH_SHORT)
                                .show()
                        } else {
                            Toast.makeText(
                                this@loginpage,
                                "Invalid Credentials",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    } else {
                        Toast.makeText(this@loginpage, "Invalid Credentials", Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<moderatorResponse>, t: Throwable) {
                    Toast.makeText(this@loginpage, "Response Failed", Toast.LENGTH_SHORT).show()
                }

            })

        } else {
            Toast.makeText(
                this@loginpage,
                "Please fill all the mandatory fields",
                Toast.LENGTH_SHORT
            ).show()
        }
    }
}