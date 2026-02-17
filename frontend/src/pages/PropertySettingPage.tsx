import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  Eye,
  Settings,
  Filter,
  Grid3x3,
  List,
  Clock,
  ToggleRight,
  Save,
  RotateCcw,
  AlertCircle,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

type PropertySettings = {
  // Default Form Values for AddPropertyModal
  defaultPropertyType: string;
  defaultBedrooms: number;
  defaultBathrooms: number;
  defaultPriceMin: number;
  defaultPriceMax: number;
  defaultStatus: 'available' | 'occupied' | 'under maintenance';
  defaultAmenities: string; // comma-separated
  defaultListingType: 'For Rent' | 'For Lease';

  // Property Display Settings
  defaultViewMode: 'grid' | 'list';
  propertiesPerPage: number;
  defaultSortBy: 'newest' | 'price-low' | 'price-high' | 'name';
  showPropertyDescription: boolean;
  showPropertyAmenities: boolean;
  showPropertyFloors: boolean;
  showPropertyOtherRooms: boolean;

  // Default Filters
  autoApplyTypeFilter: boolean;
  defaultTypeFilter: string;
  autoApplyStatusFilter: boolean;
  defaultStatusFilter: string;

  // Property Management Rules
  autoListNewProperties: boolean;
  requireDescriptionForListing: boolean;
  requireImagesForListing: number; // minimum images
  defaultVisibility: 'public' | 'private' | 'draft';
  autoCalculateArea: boolean;

  // Property Organization
  enablePropertySearchSuggestions: boolean;
  groupPropertiesByCity: boolean;
  enableBulkActions: boolean;
  archiveEmptyProperties: boolean;

  // Rent & Payment Settings
  rentCollectionDay: number; // 1-28
  sendRentReminders: boolean;
  reminderDaysBefore: number;

  // Additional Features
  enablePropertyComparison: boolean;
  showPropertyCreatedDate: boolean;
  enablePropertyNotes: boolean;
};

const PropertySettingsPage = () => {
  const [settings, setSettings] = useState<PropertySettings>({
    // Default Form Values
    defaultPropertyType: 'apartment',
    defaultBedrooms: 2,
    defaultBathrooms: 1,
    defaultPriceMin: 15000,
    defaultPriceMax: 50000,
    defaultStatus: 'available',
    defaultAmenities: 'Parking, Water Supply, Electricity',
    defaultListingType: 'For Rent',

    // Display Settings
    defaultViewMode: 'grid',
    propertiesPerPage: 12,
    defaultSortBy: 'newest',
    showPropertyDescription: true,
    showPropertyAmenities: true,
    showPropertyFloors: false,
    showPropertyOtherRooms: false,

    // Filters
    autoApplyTypeFilter: false,
    defaultTypeFilter: 'All Types',
    autoApplyStatusFilter: false,
    defaultStatusFilter: 'All Status',

    // Management
    autoListNewProperties: false,
    requireDescriptionForListing: true,
    requireImagesForListing: 1,
    defaultVisibility: 'public',
    autoCalculateArea: true,

    // Organization
    enablePropertySearchSuggestions: true,
    groupPropertiesByCity: false,
    enableBulkActions: true,
    archiveEmptyProperties: false,

    // Rent & Payment
    rentCollectionDay: 1,
    sendRentReminders: true,
    reminderDaysBefore: 3,

    // Additional
    enablePropertyComparison: true,
    showPropertyCreatedDate: false,
    enablePropertyNotes: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangeSetting = (key: keyof PropertySettings, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    toast.success('Property settings saved successfully');
  };

  const handleResetChanges = () => {
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio', 'Townhouse', 'Commercial', 'Condo', 'Penthouse'];
  const statusOptions = ['available', 'occupied', 'under maintenance'];
  const listingTypes = ['For Rent', 'For Lease'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  return (
    <>
      <Helmet>
        <title>Property Settings | PropGrowthX</title>
        <meta name="description" content="Configure property management, listing defaults, and display preferences." />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');

        .page-title {
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -1.5px;
        }

        .page-subtitle {
          color: #666;
          font-size: 15px;
        }

        .settings-card {
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .settings-card:hover {
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
        }

        .settings-card-header {
          padding: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #fafafa 0%, #fff 100%);
        }

        .settings-card-content {
          padding: 24px;
        }

        .settings-section-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #333;
          margin-bottom: 16px;
          display: block;
        }

        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-label {
          font-weight: 500;
          color: #000;
          font-size: 14px;
        }

        .setting-description {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .input-field {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          padding: 10px 12px;
          transition: all 0.3s ease;
          font-size: 14px;
          width: 100%;
          max-width: 200px;
        }

        .input-field:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 28px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #dc2626;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(22px);
        }

        .select-field {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          padding: 10px 12px;
          transition: all 0.3s ease;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .select-field:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .info-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .info-box.warning {
          background: #fffbeb;
          border-color: #fde68a;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }

          .settings-card-header {
            padding: 16px;
          }

          .settings-card-content {
            padding: 16px;
          }

          .input-field {
            max-width: 100%;
          }

          .action-buttons {
            flex-direction: column-reverse;
          }

          .action-buttons button {
            width: 100%;
          }

          .setting-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <div className="flex items-start gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild 
                  className="hover:bg-gray-100 mt-1 flex-shrink-0"
                  aria-label="Go back to profile"
                >
                  <Link to="/profile">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
                <div className="flex-1">
                  <h1 className="page-title mb-1">Property Settings</h1>
                  <p className="page-subtitle">Configure defaults, display preferences, and property management rules</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="space-y-8">
              {/* Default Form Values */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Building2 className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Default Property Form Values</h2>
                    <p className="text-sm text-gray-600 mt-1">Pre-fill values in AddPropertyModal for new listings</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Property Type</div>
                      <div className="setting-description">Auto-selected in new property form</div>
                    </div>
                    <select
                      value={settings.defaultPropertyType}
                      onChange={(e) => handleChangeSetting('defaultPropertyType', e.target.value)}
                      className="select-field"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Listing Type</div>
                      <div className="setting-description">For Rent or For Lease</div>
                    </div>
                    <select
                      value={settings.defaultListingType}
                      onChange={(e) => handleChangeSetting('defaultListingType', e.target.value)}
                      className="select-field"
                    >
                      {listingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Bedrooms</div>
                      <div className="setting-description">Bedrooms in new properties</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={settings.defaultBedrooms}
                      onChange={(e) => handleChangeSetting('defaultBedrooms', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Bathrooms</div>
                      <div className="setting-description">Bathrooms in new properties</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={settings.defaultBathrooms}
                      onChange={(e) => handleChangeSetting('defaultBathrooms', parseFloat(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Price Range (₹)</div>
                      <div className="setting-description">Minimum and maximum rent suggestions</div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={settings.defaultPriceMin}
                        onChange={(e) => handleChangeSetting('defaultPriceMin', parseInt(e.target.value))}
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={settings.defaultPriceMax}
                        onChange={(e) => handleChangeSetting('defaultPriceMax', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Status</div>
                      <div className="setting-description">Initial property status</div>
                    </div>
                    <select
                      value={settings.defaultStatus}
                      onChange={(e) => handleChangeSetting('defaultStatus', e.target.value)}
                      className="select-field"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Amenities</div>
                      <div className="setting-description">Comma-separated, auto-suggested</div>
                    </div>
                    <input
                      type="text"
                      placeholder="Parking, Water, Electricity..."
                      value={settings.defaultAmenities}
                      onChange={(e) => handleChangeSetting('defaultAmenities', e.target.value)}
                      className="input-field"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Eye className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Property Display Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Control how properties appear in PropertiesPage</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default View Mode</div>
                      <div className="setting-description">Grid or List view on page load</div>
                    </div>
                    <select
                      value={settings.defaultViewMode}
                      onChange={(e) => handleChangeSetting('defaultViewMode', e.target.value)}
                      className="select-field"
                    >
                      <option value="grid">Grid View</option>
                      <option value="list">List View</option>
                    </select>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Properties Per Page</div>
                      <div className="setting-description">Number of properties to display</div>
                    </div>
                    <input
                      type="number"
                      min="6"
                      max="48"
                      step="6"
                      value={settings.propertiesPerPage}
                      onChange={(e) => handleChangeSetting('propertiesPerPage', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Default Sort By</div>
                      <div className="setting-description">How to arrange properties</div>
                    </div>
                    <select
                      value={settings.defaultSortBy}
                      onChange={(e) => handleChangeSetting('defaultSortBy', e.target.value)}
                      className="select-field"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Show Property Description</div>
                      <div className="setting-description">Display full description in cards</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.showPropertyDescription}
                        onChange={(e) => handleChangeSetting('showPropertyDescription', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Show Amenities</div>
                      <div className="setting-description">Display amenities in property cards</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.showPropertyAmenities}
                        onChange={(e) => handleChangeSetting('showPropertyAmenities', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Show Floors</div>
                      <div className="setting-description">Display number of floors</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.showPropertyFloors}
                        onChange={(e) => handleChangeSetting('showPropertyFloors', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Show Other Rooms</div>
                      <div className="setting-description">Display other rooms count</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.showPropertyOtherRooms}
                        onChange={(e) => handleChangeSetting('showPropertyOtherRooms', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Default Filters */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Default Filters</h2>
                    <p className="text-sm text-gray-600 mt-1">Auto-apply filters when page loads</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Auto-Apply Type Filter</div>
                      <div className="setting-description">Pre-select a property type</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.autoApplyTypeFilter}
                        onChange={(e) => handleChangeSetting('autoApplyTypeFilter', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {settings.autoApplyTypeFilter && (
                    <div className="setting-row">
                      <div>
                        <div className="setting-label">Default Type Filter</div>
                      </div>
                      <select
                        value={settings.defaultTypeFilter}
                        onChange={(e) => handleChangeSetting('defaultTypeFilter', e.target.value)}
                        className="select-field"
                      >
                        <option>All Types</option>
                        <option>For Rent</option>
                        <option>For Lease</option>
                      </select>
                    </div>
                  )}

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Auto-Apply Status Filter</div>
                      <div className="setting-description">Pre-select a property status</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.autoApplyStatusFilter}
                        onChange={(e) => handleChangeSetting('autoApplyStatusFilter', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {settings.autoApplyStatusFilter && (
                    <div className="setting-row">
                      <div>
                        <div className="setting-label">Default Status Filter</div>
                      </div>
                      <select
                        value={settings.defaultStatusFilter}
                        onChange={(e) => handleChangeSetting('defaultStatusFilter', e.target.value)}
                        className="select-field"
                      >
                        <option>All Status</option>
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Under Maintenance</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Management Rules */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <ToggleRight className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Property Management Rules</h2>
                    <p className="text-sm text-gray-600 mt-1">Configure property creation and management behavior</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Auto-List New Properties</div>
                      <div className="setting-description">Automatically publish new properties</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.autoListNewProperties}
                        onChange={(e) => handleChangeSetting('autoListNewProperties', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Require Description</div>
                      <div className="setting-description">Make description mandatory</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.requireDescriptionForListing}
                        onChange={(e) => handleChangeSetting('requireDescriptionForListing', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Minimum Images Required</div>
                      <div className="setting-description">Minimum photos per property</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={settings.requireImagesForListing}
                      onChange={(e) => handleChangeSetting('requireImagesForListing', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Auto Calculate Area</div>
                      <div className="setting-description">Automatically calculate from dimensions</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.autoCalculateArea}
                        onChange={(e) => handleChangeSetting('autoCalculateArea', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Property Organization */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Settings className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Property Organization</h2>
                    <p className="text-sm text-gray-600 mt-1">Organize and manage your property portfolio</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Enable Search Suggestions</div>
                      <div className="setting-description">Show intelligent search suggestions</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.enablePropertySearchSuggestions}
                        onChange={(e) => handleChangeSetting('enablePropertySearchSuggestions', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Group Properties by City</div>
                      <div className="setting-description">Organize properties by location</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.groupPropertiesByCity}
                        onChange={(e) => handleChangeSetting('groupPropertiesByCity', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Enable Bulk Actions</div>
                      <div className="setting-description">Manage multiple properties at once</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.enableBulkActions}
                        onChange={(e) => handleChangeSetting('enableBulkActions', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Enable Property Notes</div>
                      <div className="setting-description">Add notes to each property</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.enablePropertyNotes}
                        onChange={(e) => handleChangeSetting('enablePropertyNotes', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Rent & Payment Settings */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Rent & Payment Settings</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage rent collection and reminders</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Rent Collection Day</div>
                      <div className="setting-description">Expected rent collection day (1-28)</div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="28"
                      value={settings.rentCollectionDay}
                      onChange={(e) => handleChangeSetting('rentCollectionDay', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Send Rent Reminders</div>
                      <div className="setting-description">Notify before rent collection</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.sendRentReminders}
                        onChange={(e) => handleChangeSetting('sendRentReminders', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {settings.sendRentReminders && (
                    <div className="setting-row">
                      <div>
                        <div className="setting-label">Reminder Days Before</div>
                        <div className="setting-description">Days before rent collection to send reminder</div>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={settings.reminderDaysBefore}
                        onChange={(e) => handleChangeSetting('reminderDaysBefore', parseInt(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Features */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <Check className="w-5 h-5 text-gray-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Additional Features</h2>
                    <p className="text-sm text-gray-600 mt-1">Enable extra features and functionality</p>
                  </div>
                </div>
                <div className="settings-card-content space-y-4">
                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Enable Property Comparison</div>
                      <div className="setting-description">Compare multiple properties side-by-side</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.enablePropertyComparison}
                        onChange={(e) => handleChangeSetting('enablePropertyComparison', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-row">
                    <div>
                      <div className="setting-label">Show Created Date</div>
                      <div className="setting-description">Display property creation date</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.showPropertyCreatedDate}
                        onChange={(e) => handleChangeSetting('showPropertyCreatedDate', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="settings-card">
                <div className="settings-card-content">
                  <div className="action-buttons">
                    <Button
                      variant="outline"
                      onClick={handleResetChanges}
                      disabled={!hasChanges}
                      className="border-gray-200"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Discard Changes
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      disabled={!hasChanges || isSaving}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="info-box warning">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> These settings apply to how your property forms are pre-filled and how properties are displayed across the application. Changes take effect immediately on new properties and views.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default PropertySettingsPage;