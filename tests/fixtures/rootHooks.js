import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

// Disable SSL certificate validation for test environments with self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

use(chaiAsPromised);

global.expect = expect;
