package com.example.ncc_inventory

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.ImageView

class User_Or_Admin : AppCompatActivity() {
    private lateinit var myAdmin : ImageView
    private lateinit var myManager : ImageView
    private lateinit var myUser : ImageView
    private lateinit var click : Animation
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_or_admin)

        click = AnimationUtils.loadAnimation(this,R.anim.click)
        myAdmin = findViewById(R.id.myAdmin)
        myManager = findViewById(R.id.myManager)
        myUser = findViewById(R.id.myUser)
        val intent = Intent(this,loginpage::class.java)
        myAdmin.setOnClickListener {
            myAdmin.startAnimation(click)
            intent.putExtra("check" , "100")
            startActivity(intent)
            finish()
        }
        myManager.setOnClickListener {
            myManager.startAnimation(click)
            intent.putExtra("check","010")
            startActivity(intent)
            finish()
        }
        myUser.setOnClickListener {
            myUser.startAnimation(click)
            intent.putExtra("check","001")
            startActivity(intent)
            finish()
        }
    }
}