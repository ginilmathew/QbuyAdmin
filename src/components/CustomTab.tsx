import { useState } from 'react';
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm';
import { useRouter } from 'next/router';
import ShipmentSupport from '@/pages/shipmenttab';
import RateCardTab from '@/pages/RateCradTab';
import WorkDetailsTab from '@/pages/WorkDetailsTab';
import Payout from '@/pages/Payout';
import Cashinhand from '@/pages/Cashinhand/cashinhand';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <ul>
        <li
          className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile
        </li>
        <li
          className={`tab-item ${activeTab === 'shipments' ? 'active' : ''}`}
          onClick={() => handleTabClick('shipments')}
        >
          Shipments
        </li>
        <li
          className={`tab-item ${activeTab === 'fraud' ? 'active' : ''}`}
          onClick={() => handleTabClick('fraud')}
        >
          Fraud
        </li>
        <li
          className={`tab-item ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('tickets')}
        >
          Tickets
        </li>
        <li
          className={`tab-item ${activeTab === 'payout' ? 'active' : ''}`}
          onClick={() => handleTabClick('payout')}
        >
          Payout
        </li>
        <li
          className={`tab-item ${activeTab === 'cash' ? 'active' : ''}`}
          onClick={() => handleTabClick('cash')}
        >
          Cash in Hand
        </li>
        <li
          className={`tab-item ${activeTab === 'ratecard' ? 'active' : ''}`}
          onClick={() => handleTabClick('ratecard')}
        >
          Rate Card
        </li>
        <li
          className={`tab-item ${activeTab === 'workdetails' ? 'active' : ''}`}
          onClick={() => handleTabClick('workdetails')}
        >
          Work Details
        </li>
        <li
          className={`tab-item ${activeTab === 'reservation' ? 'active' : ''}`}
          onClick={() => handleTabClick('reservation')}
        >
          Reservation
        </li>
        <li
          className={`tab-item ${activeTab === 'telecom' ? 'active' : ''}`}
          onClick={() => handleTabClick('telecom')}
        >
          Telecom
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'profile' && <RiderSupportform res={id} />}
        {activeTab === 'shipments' && <ShipmentSupport res={id} />}
        {activeTab === 'fraud' && <div>Fraud content</div>}
        {activeTab === 'tickets' && <div>Tickets content</div>}
        {activeTab === 'payout' && <div>
          <h3>Settlements</h3>
            <Payout res={id}/>
        </div>}
        {activeTab === 'cash' && <div><Cashinhand res={id}/></div>}
        {activeTab === 'workdetails' && <WorkDetailsTab res={id} />}
        {activeTab === 'ratecard' && (
          <div>
            <h3>Rate Log</h3>
            <RateCardTab res={id} handleClose={handleClose} open={open} />
          </div>
        )}
        {activeTab === 'reservations' && <div>Reservations</div>}
        {activeTab === 'telecom' && <div>telecom content</div>}
      </div>

      <style jsx>{`
  .tabs-container {
    position: relative;
    margin-top: 20px;
    padding-left: 0;
  }

  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding-left: 0;
    margin-left: 0;
    align-items: center; 
    justify-content: flex-start;
  }

  .tab-item {
    flex: 1; 
    min-width: 120px; 
    max-width: 146px; 
    padding: 10px;
    margin-right: 10px;
    border: 3px solid #58D36E;
    background-color: #FFFFFF;
    color: #000;
    cursor: pointer;
    border-radius: 15px;
    font: normal 14px/27px Poppins;
    letter-spacing: 0px;
    box-shadow: 0px 3px 6px #00000029;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center; 
  }

  .tab-item:last-child {
    margin-right: 0;
  }

  .tab-item.active {
    background-color: #58D36E;
    color: #fff;
  }

  .tab-content {
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .tab-item {
      font-size: 10px; 
      padding: 5px 10px; 
    }

    ul {
      justify-content: space-around;
    }
  }
`}</style>




    </div>
  );
};

export default Tabs;
