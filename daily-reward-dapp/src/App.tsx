import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useState } from "react";
import Agent from "./Agent";
import { getChronoSdk } from "@planetarium/chrono-sdk";
import {
	useAccounts,
	useConnect,
	useNetwork,
} from "@planetarium/chrono-sdk/hooks";

function App() {
	const [currentAccount, setCurrentAccount] = useState<number>(0);
	const [txId, setTxId] = useState<string | null>(null);

	const {
		data: accountsData,
		isLoading: accountsLoading,
		isSuccess: accountsSuccess,
		error: accountsError,
	} = useAccounts();
	const { connectAsync, isPending } = useConnect();
	const {
		data: networksData,
		isLoading: networksLoading,
		isSuccess: networksSuccess,
	} = useNetwork();

	const chronoWallet = getChronoSdk();

	if (chronoWallet === undefined) {
		return (
			<div className="flex flex-col bg-gray-900 justify-center items-center min-w-screen min-h-screen">
				There is no Chrono Wallet. You should install Chrono wallet first to use
				this app.
			</div>
		);
	}

	if (accountsLoading || networksLoading) {
		return <>Loading...</>;
	}

	if (!accountsSuccess) {
		return <>Accounts are not loaded successful. error: {accountsError}</>;
	}

	if (!networksSuccess) {
		return <>Network is not loaded successful.</>;
	}

	const { accounts, isConnected } = accountsData;
	const { network, isConnected: networkIsConnected } = networksData;

	if (!isConnected || !networkIsConnected) {
		return (
			<div className="flex flex-col bg-gray-900 justify-center items-center min-w-screen min-h-screen">
				<p className="text-white mb-6 text-lg font-bold">
					You must connect (allow) this site on Chrono first.
				</p>
				{isPending || (
					<button
						className="bg-white p-4 font-bold"
						onClick={() => connectAsync()}
					>
						Connect
					</button>
				)}
				{isPending && (
					<button
						className="bg-white p-4 font-bold"
						disabled
						onClick={() => connectAsync()}
					>
						Connecting
					</button>
				)}
			</div>
		);
	}

	if (!network.gqlEndpoint) {
		return <>No GraphQL endpoint found for the network.</>;
	}

	const client = new ApolloClient({
		uri: network.gqlEndpoint,
		cache: new InMemoryCache(),
	});

	const explorerEndpoint = (network as any).explorerEndpoint; // @ts-ignore

	return (
		<ApolloProvider client={client}>
			<div className="flex flex-col bg-gray-900 justify-center items-center min-w-screen min-h-screen">
				<select
					className="select-wrapper border-[16px] border-white"
					onChange={(e) => setCurrentAccount(Number(e.target.value))}
				>
					{...accounts.map((acc, index) => (
						<option key={acc.toString()} value={index}>
							{acc.toString()}
						</option>
					))}
				</select>
				<Agent
					agentAddress={accounts[currentAccount]}
					setTxId={setTxId}
				/>
				{txId && (<p className="text-white mt-4">Last Transaction : <a className="text-cyan-500 underline" href={`${explorerEndpoint}/tx/${txId}`}>9cscan</a></p>)}
			</div>
		</ApolloProvider>
	);
}

export default App;
