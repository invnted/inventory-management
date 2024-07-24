package com.example.ncc_inventory

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import java.util.Locale

class receivedDemandAdapter(val context: Context, val adapterItems: List<formattedDemands>) :
    RecyclerView.Adapter<receivedDemandAdapter.ViewHolderClass>() {
    private var filteredUsers: List<formattedDemands> = adapterItems

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolderClass {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.received_itemuser,parent,false)
        return ViewHolderClass(itemView)
    }

    override fun getItemCount(): Int {
        return filteredUsers.size
    }

    override fun onBindViewHolder(holder: ViewHolderClass, position: Int) {
        val currentItem = filteredUsers[position]
        holder.date.text = currentItem.updatedAt
        holder.productName.text = currentItem.productName
        holder.productType.text = currentItem.productType
        holder.productModel.text = currentItem.productModel
        holder.productBrand.text = currentItem.productBrand
        holder.status.text = "Issued"
    }

    fun filter(query: String) {
        filteredUsers = if (query.isEmpty()) {
            adapterItems
        }else{
            adapterItems.filter {
                it.productType.lowercase(Locale.ROOT).contains(query.lowercase(Locale.ROOT)) || it.productName.lowercase(
                    Locale.ROOT).contains(query.lowercase(Locale.ROOT))||it.productType.lowercase(Locale.ROOT).contains(query.lowercase(
                    Locale.ROOT))
            }
        }
        notifyDataSetChanged()
    }

    class ViewHolderClass(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val date: TextView = itemView.findViewById(R.id.ctAt)
        val productName :  TextView = itemView.findViewById<TextView>(R.id.Rname)
        val productType :  TextView = itemView.findViewById<TextView>(R.id.Rtype)
        val productModel :  TextView = itemView.findViewById<TextView>(R.id.Rmodel)
        val productBrand : TextView = itemView.findViewById<TextView>(R.id.Rband)
        val status :  TextView = itemView.findViewById<TextView>(R.id.Rstatus)
    }
}