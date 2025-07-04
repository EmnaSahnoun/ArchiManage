package com.example.CommercialService.interfaces;

import com.example.CommercialService.models.Client;

import java.util.List;

public interface IClient {
    Client createClient(Client client , String authToken);
    Client createClientwithoutKeycloak(Client client , String authToken);
    Client updateClient(String id, Client client);
    void deleteClient(String id,String authToken);
    Client getClientById(String id);
    List<Client> getClientsByCompanyId(String companyId);

}
