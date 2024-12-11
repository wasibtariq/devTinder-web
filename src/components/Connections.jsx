import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {withCredentials: true});
            dispatch(addConnections(res.data.data));
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if(connections.length === 0) return <h1 className="flex justify-center my-10">No connections found!</h1>;

    return (
        <div className="text-center my-10">
            <h1 className="font-bold text-3xl text-white my-5">Connections</h1>
                {connections.map(connection => {
                    const {_id, firstName, lastName, photoUrl, age, gender, about} = connection; 
                    return (
                        <div key={_id} className="flex p-4 mx-auto rounded-lg bg-base-300 w-1/3 my-2">
                            <div><img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl}/></div>
                            <div className="text-left mx-4"><h2 className="font-bold text-xl">{firstName + " " + lastName}</h2>
                            {age && gender && <p>{age +" yrs, "+ gender}</p>}
                            <p>{about}</p></div>
                        </div>
                    )
                })}
        </div>
    )
}

export default Connections;