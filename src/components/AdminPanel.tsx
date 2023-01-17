import React, { useState } from 'react'
import { ethers } from "ethers";
interface Props {
    account?: string;
    chatContract: ethers.Contract | undefined;
}

const AdminPanel = ({ account, chatContract }: Props) => {
    const [banUserAddress, setBanUserAddress] = useState<string>("");
    const [changeAdminAddress, setAdminAddress] = useState<string>("");
    const [txnStatus, setTxnStatus] = useState<string | null>(null);

    const deleteMessages = async () => {
        if (!chatContract) return;
        try {
            setTxnStatus("⌛");
            const messageTxn = await chatContract.deleteMessages()
            await messageTxn.wait();
        } catch (e) {
            console.warn("Transaction failed with error", e);
        } finally {
            setTxnStatus(null);
        }
    };

    const banUser = async () => {
        if (!chatContract) return;
        try {
            const messageTxn = await chatContract.banUser(banUserAddress)
            await messageTxn.wait();
        } catch (e) {
            console.warn("Transaction failed with error", e);
        } finally {
            setBanUserAddress("");
            setTxnStatus(null);
        }
    };

    const changeAdmin = async () => {
        if (!chatContract) return;
        try {
            const messageTxn = await chatContract.changeAdmin(changeAdminAddress)
            await messageTxn.wait();
        } catch (e) {
            console.warn("Transaction failed with error", e);
        } finally {
            setAdminAddress("");
            setTxnStatus(null);
        }
    };

    return (
        <div className="admin-panel-wrapper">
            <h2 className="section-title">AdminPanel</h2>
            <div className="clear-chat-section">
                <button onClick={deleteMessages} className="clear-chat-button" disabled={!!txnStatus} >Clear Chat</button>
            </div>
            <div className="ban-user-section">
                <input type="text" placeholder="Enter user adress..." value={banUserAddress}
                    disabled={!!txnStatus}
                    onChange={(e) => {
                        setBanUserAddress(e.target.value);
                    }} 
                    className="ban-adress-input" />
                <button onClick={banUser} className="ban-button" disabled={!!txnStatus}>{txnStatus || "BAN USER"}</button>
            </div>
            <div className="change-admin-section">
                <input type="text" placeholder="Enter user adress..." value={changeAdminAddress}
                    disabled={!!txnStatus}
                    onChange={(e) => {
                        setAdminAddress(e.target.value);
                    }} 
                    className="change-admin-input" />
                <button onClick={changeAdmin} className="change-button" disabled={!!txnStatus}>{txnStatus || "MAKE ADMIN"}</button>
            </div>
        </div>
    )
}

export default AdminPanel