import * as React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";

const Requests = () => {
    const requests = useSelector((store) => store.requests);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
            const res = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {withCredentials: true});
            dispatch(removeRequest(_id));
        } catch (err) {
            console.error(err);
        }
    }

    const fetchRequests = async () => {
        try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {withCredentials: true});
        dispatch(addRequests(res.data.data));
        
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    if (!requests) return;

    if(requests.length === 0) return <h1 className="flex justify-center my-10">No requests found!</h1>;

    return (
        <div className="text-center my-10">
            <h1 className="font-bold text-3xl text-white my-5">Connection Requests</h1>
                {requests.map(request => {
                    const {_id, firstName, lastName, photoUrl, age, gender, about} = request.fromUserId; 
                    return (
                        <div key={_id} className="flex justify-between items-center p-4 mx-auto rounded-lg bg-base-300 w-1/2 my-2">
                            <div><img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl}/></div>
                            <div className="text-left mx-4"><h2 className="font-bold text-xl">{firstName + " " + lastName}</h2>
                            {age && gender && <p>{age +" yrs, "+ gender}</p>}
                            <p>{about}</p></div>
                            <div>
                            <button className="btn btn-active btn-primary mx-2" onClick={() =>reviewRequest("rejected", request._id)}>Reject</button>
                            <button className="btn btn-active btn-secondary mx-2" onClick={() =>reviewRequest("accepted", request._id)}>Accept</button>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default Requests;