interface Company {
    name: string;
    description: string;
    logo: string;
}
interface LocationChild {
    name: string;
    api: string;
    filesUrl: string;
    ipv4: string;
    ipv6: string;
    location: string;
    datacenter: string;
    bgp: boolean;
    pingtrace: boolean;
}
interface LocationGroup {
    name: string;
    locations: LocationChild[];
}
interface Config {
    company: Company;
    locations: LocationGroup[];
}