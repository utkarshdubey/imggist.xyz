import React from 'react';
import { Layout, Menu, Typography, Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './App.css';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error('Image must smaller than 20MB!');
  }
  return isJpgOrPng && isLt2M;
}

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = { loading: false }
    
  }
  handleCopy = e => {
    navigator.clipboard.writeText(this.state.fileURL).then(function(){
      message.success("Copied to clipboard");
    }, function(err){
      message.error("An error occurred while copying");
    })
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
      message.success('The file has been uploaded successfully.');
      this.setState({fileURL: "https://imggist-api.herokuapp.com/" + info.file.response.file.title})
    }
  };
  render(){
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return(
      <Layout>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">imggist.xyz - upload images like everywhere else</Menu.Item>
      </Menu>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
      <div className="site-layout-background" style={{ padding: 35, minHeight: 380, display: "flex", justifyContent:"center", alignItems:"center", backgroundColor: "white"}}>
        <div>
        <Title style={{textAlign: "center"}}>imggist <span role="img" aria-label="Folder emoji">📁</span></Title>
        <span>Upload files and access them anywhere almost instantly with <b>blazing fast</b> CDN speed.</span>
        
        <center>
        {this.state.fileURL ? (<div>
          <span>
            You can access your file at <a href={this.state.fileURL}>{this.state.fileURL}</a>
          </span>
          <Button onClick={this.handleCopy} type="primary" danger block>Copy to clipboard</Button>
        </div>) : (<div></div>)}
        <div>
        </div>
        </center>
        </div>
        <div style={{padding: 10, marginLeft: "auto", marginRight: "auto"}}>
          <Upload
          name="upload"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://cors-anywhere.herokuapp.com/https://imggist-api.herokuapp.com/upload"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      </div>
      </div>
      
    </Content>
    <Footer style={{ textAlign: 'center' }}>Created with <span role="img" aria-label="heart">❤️</span> by <a href="https://utkarsh.co">Utkarsh</a>.</Footer>
  </Layout>
    )
  }
}


export default App;