package com.example.ncc_inventory

import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.TextView
import androidx.core.app.NavUtils
import org.w3c.dom.Text

class adminUserprofile : AppCompatActivity() {
    private lateinit var pName : TextView
    private lateinit var userName : TextView
    private lateinit var userId : TextView
    private lateinit var userPass : TextView
    private lateinit var userDesig : TextView
    private lateinit var userSection : TextView
    private lateinit var userAppointment : TextView
    private lateinit var backbtn : ImageView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_userprofile)

        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        pName = findViewById(R.id.PnameU)
        userName = findViewById(R.id.userNamePf)
        userId = findViewById(R.id.userIdpf)
        userPass = findViewById(R.id.userPasspf)
        userDesig = findViewById(R.id.userDesigpf)
        userSection = findViewById(R.id.userSectionpf)
        userAppointment = findViewById(R.id.userappt)

        val gUsername = intent.getStringExtra("name")
        val gUserId = intent.getStringExtra("id")
        val gUserPass = intent.getStringExtra("password")
        val gUserDesig = intent.getStringExtra("desig")
        val gUserAppt = intent.getStringExtra("appt")
        val gUserSection = intent.getStringExtra("section")

        pName.text = gUsername
        userName.text = gUsername
        userId.text = gUserId
        userPass.text = gUserPass
        userDesig.text = gUserDesig
        userSection.text = gUserSection
        userAppointment.text = gUserAppt

        val click = AnimationUtils.loadAnimation(this,R.anim.click)
        backbtn = findViewById(R.id.mybbUser)
        backbtn.setOnClickListener {
            backbtn.startAnimation(click)
            goToparentActivity()
        }

    }

    private fun goToparentActivity() {
        val parentIntent = NavUtils.getParentActivityIntent(this)
        if (parentIntent != null) {
            // Navigate to the parent activity
            NavUtils.navigateUpTo(this, parentIntent)
        } else {
            // Handle the case where no parent activity is specified (optional)
            finish()
        }
    }
}