// import { useEffect, useState } from "react";
import BusinessCardScanner from "./components/BusinessCardScanner";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";

// const client = generateClient<Schema>();

function App() {

  return (
    <main>
      <div>
       <BusinessCardScanner/>
      </div>
    </main>
  );
}

export default App;
