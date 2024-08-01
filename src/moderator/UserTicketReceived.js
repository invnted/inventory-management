import React, { useEffect, useState } from 'react';
import ModeratorNavbar from './ModeratorNavbar';
import { toast } from 'react-toastify';
import fetchWithToken from '../services/api';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const GET_TICKETS_URL = `${serverUrl}/products/getAllTickets`;
const UPDATE_TICKET_URL = `${serverUrl}/products/updateTicket`;

function UserTicketReceived() {
    const [ticketData, setTicketData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await fetchWithToken(GET_TICKETS_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Fetched ticket data:', data);
                if (data.success) {
                    setTicketData(data.tickets);
                }
            } catch (error) {
                toast.error("Error fetching ticket data");
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchTicketData();
    }, []);

    const handleUpdateStatus = async (ticketId, newStatus) => {
        try {
            const response = await fetchWithToken(UPDATE_TICKET_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ticketId, status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                if (newStatus === 'RESOLVED') {
                    // Remove the ticket from the list
                    setTicketData(ticketData.filter(ticket => ticket.ticketId !== ticketId));
                    toast.success("Issue Resolved Successfully");
                } else {
                    // Update ticket status without removing it from the list
                    setTicketData(ticketData.map(ticket =>
                        ticket.ticketId === ticketId ? { ...ticket, status: newStatus } : ticket
                    ));
                    toast.success("Ticket Updated");
                }
            }
        } catch (error) {
            toast.error("Error updating ticket status");
            console.error('Error updating ticket status:', error);
        }
    };

    const handleReviewClick = (ticketId) => {
        handleUpdateStatus(ticketId, 'UNDER REVIEW');
    };

    const handleResolveClick = (ticketId) => {
        handleUpdateStatus(ticketId, 'RESOLVED');
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ticketData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(ticketData.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 mx-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-blue-500 rounded`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <ModeratorNavbar />
            <div className='m-4 md:m-12 justify-between'>
                <div className='flex justify-center items-center text-5xl p-6 bg-sky-800 text-white font-bold'>
                    User Ticket Received
                </div>
                <div className='bg-sky-300'>
                    <form className="max-w-md mx-auto md:pt-20 p-6">
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm rounded-lg bg-sky-600 placeholder-gray-300 outline-none text-white" placeholder="Search Using Name / ID" required />
                        </div>
                    </form>
                    <div className="p-2 md:p-10">
                        <button className="bg-sky-800 text-white p-2 rounded-md" onClick={() => window.location.reload()}>Refresh</button>
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-sky-100 border border-black">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border border-black text-center">Ticket ID</th>
                                        <th className="py-2 px-4 border border-black text-center">Issue Type</th>
                                        <th className="py-2 px-4 border border-black text-center">Message</th>
                                        <th className="py-2 px-4 border border-black text-center">Raised By</th>
                                        <th className="py-2 px-4 border border-black text-center">Product ID</th>
                                        <th className="py-2 px-4 border border-black text-center">Status</th>
                                        <th className="py-2 px-4 border border-black text-center">Created At</th>
                                        <th className="py-2 px-4 border border-black text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((ticket) => (
                                            <tr key={ticket._id}>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.ticketId}</td>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.issueType}</td>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.message}</td>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.issuedBy}</td>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.productId}</td>
                                                <td className="py-2 px-4 border border-black text-center">{ticket.status}</td>
                                                <td className="py-2 px-4 border border-black text-center">{new Date(ticket.createdAt).toLocaleString()}</td>
                                                <td className="py-2 px-4 border border-black text-center">
                                                    {ticket.status === 'UNDER REVIEW' ? (
                                                        <button
                                                            className="bg-green-500 text-white p-2 rounded-md"
                                                            onClick={() => handleResolveClick(ticket.ticketId)}
                                                        >
                                                            RESOLVE
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="bg-yellow-500 text-white p-2 rounded-md"
                                                            onClick={() => handleReviewClick(ticket.ticketId)}
                                                        >
                                                            REVIEW
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-2 px-4 border border-black text-center">
                                                No tickets found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            {renderPageNumbers()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserTicketReceived;
