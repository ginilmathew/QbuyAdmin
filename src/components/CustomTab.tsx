import { useState } from 'react';
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm';
import { useRouter } from 'next/router';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { id } = router.query;

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <ul>
        <li
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => handleTabClick('profile')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Profile
        </li>
        <li
          className={activeTab === 'shipments' ? 'active' : ''}
          onClick={() => handleTabClick('shipments')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Shipments
        </li>
        <li
          className={activeTab === 'fraud' ? 'active' : ''}
          onClick={() => handleTabClick('fraud')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Fraud
        </li>
        <li
          className={activeTab === 'tickets' ? 'active' : ''}
          onClick={() => handleTabClick('tickets')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Tickets
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'profile' && <RiderSupportform res={id} />}
        {activeTab === 'shipments' && <div>Shipments content</div>}
        {activeTab === 'fraud' && <div>Fraud content</div>}
        {activeTab === 'tickets' && <div>Tickets content</div>}
      </div>

      <style jsx>{`
        ul {
          list-style: none;
          display: flex;
        }

        li.active {
          background-color: #0070f3;
          color: white;
        }

        .tab-content {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Tabs;
